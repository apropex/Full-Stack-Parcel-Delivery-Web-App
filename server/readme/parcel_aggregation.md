নিচে একটি একক TypeScript ফাইল দেওয়া হলো, যেখানে পূর্ববর্তী `parcelPipelineBuilder.ts` এবং `parcelService.ts` এর কোড একত্রিত করা হয়েছে। এই ফাইলটি প্রোডাকশন-লেভেল, রিইউজেবল, এবং স্কেলেবল। এটি আগের কুয়েরি প্যারামিটারগুলো (`search`, `status`, `type`, `trackingId`, `sort`, `skip`, `limit`) হ্যান্ডল করে এবং তিনটি ফাংশন (`getParcels`, `getParcelsForAdmin`, `getParcelsForUser`) প্রদান করে, যা একই pipeline builder ব্যবহার করে। ফাইলটি `parcelAggregation.ts` নামে সংরক্ষণ করা যেতে পারে।

```typescript
// parcelAggregation.ts
import { Document, PipelineStage } from "mongoose";
import { Parcel } from "@/models/parcel"; // Assuming Parcel is the Mongoose model
import { ParcelTypes } from "@/constants";

// Define query interface for type safety (reusable across functions)
export interface ParcelQuery {
  search?: string;
  status?: string;
  type?: string;
  trackingId?: string;
  sort?: string;
  skip?: number;
  limit?: number;
}

/**
 * Builds a reusable aggregation pipeline for Parcel queries.
 * @param query - Object containing search, status, type, trackingId, sort, skip, and limit
 * @returns An array of PipelineStage for MongoDB aggregation
 */
function buildParcelPipeline(query: ParcelQuery): PipelineStage[] {
  const {
    search = "",
    status,
    type,
    trackingId,
    sort = "-createdAt", // Default sort by createdAt
    skip = 0,
    limit = 12, // Default limit
  } = query;

  // Validate inputs to prevent invalid queries
  const safeSkip = Math.max(0, Number(skip) || 0);
  const safeLimit = Math.max(1, Math.min(Number(limit) || 12, 100)); // Cap limit at 100 for performance
  const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
  const sortOrder = sort.startsWith("-") ? -1 : 1;

  // Build match stage for filtering
  const matchStage: any = {};

  // Flexible search across title, description, and address fields
  if (search) {
    const searchRegex = { $regex: search.trim(), $options: "i" }; // Case-insensitive regex
    matchStage.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { "pickupAddress.street": searchRegex },
      { "pickupAddress.city": searchRegex },
      { "pickupAddress.stateOrProvince": searchRegex },
      { "pickupAddress.postalCode": searchRegex },
      { "pickupAddress.country": searchRegex },
      { "deliveryAddress.street": searchRegex },
      { "deliveryAddress.city": searchRegex },
      { "deliveryAddress.stateOrProvince": searchRegex },
      { "deliveryAddress.postalCode": searchRegex },
      { "deliveryAddress.country": searchRegex },
    ];
  }

  // Filter by status
  if (status) {
    matchStage.status = status;
  }

  // Filter by type (validate against enum)
  if (type && Object.values(ParcelTypes).includes(type)) {
    matchStage.type = type;
  }

  // Filter by trackingId
  if (trackingId) {
    matchStage.trackingId = trackingId;
  }

  // Build the pipeline stages
  const pipeline: PipelineStage[] = [
    // Match stage for filtering (early for performance)
    { $match: matchStage },

    // Lookup for sender
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender",
        pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
      },
    },

    // Lookup for receiver
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receiver",
        pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
      },
    },

    // Lookup for updatedUsers in statusLogs
    {
      $lookup: {
        from: "users",
        localField: "statusLogs.updatedBy",
        foreignField: "_id",
        as: "updatedUsers",
        pipeline: [{ $project: { _id: 1, name: 1 } }],
      },
    },

    // Transform and populate fields
    {
      $addFields: {
        sender: { $arrayElemAt: ["$sender", 0] },
        receiver: { $arrayElemAt: ["$receiver", 0] },
        statusLogs: {
          $map: {
            input: {
              $sortArray: {
                input: "$statusLogs",
                sortBy: { updatedAt: -1 }, // Sort statusLogs by updatedAt desc
              },
            },
            as: "log",
            in: {
              status: "$$log.status",
              updatedAt: "$$log.updatedAt",
              updatedFrom: "$$log.updatedFrom",
              note: "$$log.note",
              updatedBy: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$updatedUsers",
                      cond: { $eq: ["$$this._id", "$$log.updatedBy"] },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },
    },

    // Sort stage
    {
      $sort: {
        [sortField]: sortOrder,
      },
    },

    // Pagination: skip and limit
    { $skip: safeSkip },
    { $limit: safeLimit },
  ];

  return pipeline;
}

/**
 * Fetch parcels with flexible filtering, searching, sorting, and pagination.
 * @param query - Object containing search, status, type, trackingId, sort, skip, and limit
 * @returns Promise resolving to an array of parcels
 */
export async function getParcels(query: ParcelQuery): Promise<Document[]> {
  try {
    const pipeline = buildParcelPipeline(query); // Reuse the pipeline builder
    const parcels = await Parcel.aggregate(pipeline);
    return parcels;
  } catch (error) {
    console.error("Error fetching parcels:", error);
    throw new Error("Failed to fetch parcels");
  }
}

/**
 * Fetch parcels for admin dashboard (e.g., with additional filters like blocked parcels).
 * @param query - Base query parameters
 * @param adminId - Admin user ID for additional logic (example)
 * @returns Promise resolving to an array of parcels
 */
export async function getParcelsForAdmin(
  query: ParcelQuery,
  adminId: string
): Promise<Document[]> {
  try {
    // Add admin-specific filters (example: exclude blocked parcels)
    const extendedQuery: ParcelQuery = {
      ...query,
      // Example: Add custom filter (can be dynamic)
    };

    const pipeline = buildParcelPipeline(extendedQuery); // Reuse the pipeline

    // Optional: Add admin-specific stages (e.g., additional projection)
    pipeline.push({
      $project: {
        // Example: Include all fields and add admin-only fields if needed
        _id: 1,
        trackingId: 1,
        title: 1,
        description: 1,
        type: 1,
        weight: 1,
        rent: 1,
        images: 1,
        pickupAddress: 1,
        deliveryAddress: 1,
        sender: 1,
        receiver: 1,
        status: 1,
        isBlocked: 1,
        isCancelled: 1,
        statusLogs: 1,
        createdAt: 1,
        updatedAt: 1,
        updatedUsers: 1,
        // Hypothetical admin-only field
        internalNotes: 1,
      },
    });

    const parcels = await Parcel.aggregate(pipeline);
    // Additional admin logic (e.g., logging)
    console.log(`Admin ${adminId} fetched ${parcels.length} parcels`);
    return parcels;
  } catch (error) {
    console.error("Error fetching admin parcels:", error);
    throw new Error("Failed to fetch admin parcels");
  }
}

/**
 * Fetch parcels for a specific user (e.g., sender or receiver).
 * @param query - Base query parameters
 * @param userId - User ID to filter by sender or receiver
 * @returns Promise resolving to an array of parcels
 */
export async function getParcelsForUser(
  query: ParcelQuery,
  userId: string
): Promise<Document[]> {
  try {
    // Extend query with user-specific filter
    const extendedQuery: ParcelQuery = { ...query };

    const pipeline = buildParcelPipeline(extendedQuery); // Reuse the pipeline

    // Insert user-specific match early (for performance)
    pipeline.unshift({
      $match: {
        $or: [{ sender: userId }, { receiver: userId }],
      },
    });

    const parcels = await Parcel.aggregate(pipeline);
    return parcels;
  } catch (error) {
    console.error("Error fetching user parcels:", error);
    throw new Error("Failed to fetch user parcels");
  }
}
```

---

### ফাইলের বিবরণ

- **ফাইল নাম**: `parcelAggregation.ts`
- **কনটেন্ট**:
  - `ParcelQuery` ইন্টারফেস: কুয়েরি প্যারামিটারগুলোর টাইপ সেফটি নিশ্চিত করে।
  - `buildParcelPipeline`: রিইউজেবল পাইপলাইন বিল্ডার, যা সকল ফাংশনে ব্যবহৃত হয়।
  - `getParcels`: সাধারণ পার্সেল ফেচ করার জন্য।
  - `getParcelsForAdmin`: অ্যাডমিনের জন্য, অতিরিক্ত প্রজেকশন সহ।
  - `getParcelsForUser`: ইউজার-স্পেসিফিক ফিল্টারিং (sender/receiver) সহ।
- **ডিপেন্ডেন্সি**:
  - `mongoose`: MongoDB এর জন্য।
  - `Parcel` মডেল: Mongoose স্কিমা থেকে ইমপোর্ট।
  - `ParcelTypes`: Enum কনস্ট্যান্ট।

---

### কীভাবে ইউজ করবেন?

1. **ইমপোর্ট করুন**:

   ```typescript
   import {
     getParcels,
     getParcelsForAdmin,
     getParcelsForUser,
   } from "@/services/parcelAggregation";
   ```

2. **কন্ট্রোলারে ইউজ করুন** (উদাহরণ):

   ```typescript
   // controllers/parcelController.ts
   import { Request, Response } from "express";
   import {
     getParcels,
     getParcelsForAdmin,
     getParcelsForUser,
   } from "@/services/parcelAggregation";

   // General parcels
   export async function getParcelsController(req: Request, res: Response) {
     try {
       const parcels = await getParcels({
         search: req.query.search as string,
         status: req.query.status as string,
         type: req.query.type as string,
         trackingId: req.query.trackingId as string,
         sort: req.query.sort as string,
         skip: Number(req.query.skip),
         limit: Number(req.query.limit),
       });
       res.status(200).json({ success: true, data: parcels });
     } catch (error) {
       res.status(500).json({ success: false, message: "Failed to fetch parcels" });
     }
   }

   // Admin parcels
   export async function getAdminParcelsController(req: Request, res: Response) {
     try {
       const parcels = await getParcelsForAdmin(
         {
           search: req.query.search as string,
           status: req.query.status as string,
           type: req.query.type as string,
           trackingId: req.query.trackingId as string,
           sort: req.query.sort as string,
           skip: Number(req.query.skip),
           limit: Number(req.query.limit),
         },
         req.user.id // Assuming req.user.id from auth middleware
       );
       res.status(200).json({ success: true, data: parcels });
     } catch (error) {
       res.status(500).json({ success: false, message: "Failed to fetch admin parcels" });
     }
   }

   // User parcels
   export async function getUserParcelsController(req: Request, res: Response) {
     try {
       const parcels = await getParcelsForUser(
         {
           search: req.query.search as string,
           status: req.query.status as string,
           type: req.query.type as string,
           trackingId: req.query.trackingId as string,
           sort: req.query.sort as string,
           skip: Number(req.query.skip),
           limit: Number(req.query.limit),
         },
         req.user.id // Assuming req.user.id from auth middleware
       );
       res.status(200).json({ success: true, data: parcels });
     } catch (error) {
       res.status(500).json({ success: false, message: "Failed to fetch user parcels" });
     }
   }
   ```

3. **উদাহরণ কুয়েরি**:
   - সাধারণ পার্সেল: `GET /parcels?search=electronics&status=Delivered&type=Document&sort=-weight&skip=10&limit=5`
   - অ্যাডমিন পার্সেল: `GET /admin/parcels?status=Received`
   - ইউজার পার্সেল: `GET /user/parcels?trackingId=TRK-ZB8F20MUT12Y`

---

### প্রোডাকশন লেভেলের বেস্ট প্র্যাকটিস

- **রিইউজেবিলিটি**: `buildParcelPipeline` ফাংশনটি সব ফাংশনে ব্যবহৃত হয়, কোড ডুপ্লিকেশন এড়ায়।
- **এক্সটেন্ডেবিলিটি**: নতুন ফাংশনে অতিরিক্ত `$match` বা `$project` যোগ করা সহজ (দেখুন `getParcelsForUser` এ `unshift`)।
- **টাইপ সেফটি**: `ParcelQuery` ইন্টারফেস এবং Mongoose এর `PipelineStage` টাইপ ব্যবহার।
- **পারফর্ম্যান্স**: Early `$match`, capped `limit`, এবং `$project` দিয়ে ডাটা ফিল্টারিং।
- **সিকিউরিটি**: ইনপুট ভ্যালিডেশন (`Math.max/min`, `trim`) এবং enum চেক।
- **ইরর হ্যান্ডলিং**: Try-catch এবং লগিং।
- **ডকুমেন্টেশন**: JSDoc কমেন্টস।
- **ইন্ডেক্স**: নিশ্চিত করুন ডাটাবেসে ইন্ডেক্স আছে:
  ```javascript
  Parcel.createIndexes([
    { key: { trackingId: 1 } },
    { key: { status: 1 } },
    { key: { type: 1 } },
    { key: { createdAt: 1 } },
    {
      key: {
        title: "text",
        description: "text",
        "pickupAddress.street": "text",
        "pickupAddress.city": "text",
        "pickupAddress.stateOrProvince": "text",
        "pickupAddress.postalCode": "text",
        "pickupAddress.country": "text",
        "deliveryAddress.street": "text",
        "deliveryAddress.city": "text",
        "deliveryAddress.stateOrProvince": "text",
        "deliveryAddress.postalCode": "text",
        "deliveryAddress.country": "text",
      },
    },
  ]);
  ```
- **টেস্টিং**: Jest দিয়ে টেস্ট লিখুন:
  ```typescript
  describe("Parcel Aggregation", () => {
    it("should build pipeline with search and filters", () => {
      const pipeline = buildParcelPipeline({ search: "electronics", status: "Delivered" });
      expect(pipeline).toMatchSnapshot();
    });
  });
  ```

এই ফাইলটি একটি সম্পূর্ণ, প্রোডাকশন-রেডি সমাধান। যদি আরও কাস্টমাইজেশন বা নির্দিষ্ট ফিচার যোগ করতে চান, জানান।
