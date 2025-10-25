/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParcelStatus, ParcelTypes } from "@/constants";
import { Search, SearchIcon, Trash2Icon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

// query.search - flexible search for title,description,and all address fields
// query.status - filter parcel status field
// query.trackingId - filter parcel trackingId
// query.skip - skip pages
// query.limit - skip limit (default 12)

export default function DataFiltering() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [trackingId, setTrackingId] = useState<string>("");
  const [sortItem, setSortItem] = useState<string>("");
  const [sortType, setSortType] = useState<string>("ascending");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setSearch(() => searchParams.get("search") || "");
    setTrackingId(() => searchParams.get("trackingId") || "");
    setSortItem(() => {
      const sort = searchParams.get("sort") || undefined;
      if (sort && sort.startsWith("-")) {
        return sort.substring(1);
      } else if (sort) return sort;
      else return "";
    });
    setSortType(() => {
      const sort = searchParams.get("sort") || undefined;
      if (sort && sort.startsWith("-")) return "descending";
      else return "ascending";
    });
  }, [searchParams]);

  useEffect(() => {
    handleSortItemChange();
  }, [sortItem, sortType]);

  const handleSearchChange = () => {
    const params = new URLSearchParams(searchParams);
    if (search) params.set("search", search);
    else params.delete("search");
    setSearchParams(params);
  };

  const handleTrackingIdChange = () => {
    const params = new URLSearchParams(searchParams);
    if (trackingId) params.set("trackingId", trackingId);
    else params.delete("trackingId");
    setSearchParams(params);
  };

  const handleParcelStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "none") params.set("status", value);
    else params.delete("status");
    setSearchParams(params);
  };

  const handleParcelTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "none") params.set("type", value);
    else params.delete("type");
    setSearchParams(params);
  };

  const handleSortItemChange = () => {
    const params = new URLSearchParams(searchParams);
    if (sortItem && sortItem !== "none") {
      const sortValue = sortType === "ascending" ? sortItem : `-${sortItem}`;
      params.set("sort", sortValue);
    } else params.delete("sort");
    setSearchParams(params);
  };

  const clearFilters = () => {
    setOpen(false);
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.delete("sort");
    params.delete("status");
    params.delete("type");
    params.delete("trackingId");
    params.delete("page");
    params.delete("limit");
    params.delete("skip");

    setSearch("");
    setTrackingId("");
    setSortItem("");
    setSortType("ascending");

    setSearchParams(params);
  };

  return (
    <div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="filters"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              <div>
                <Label className="mb-2 text-sm">Enter your tracking id here</Label>
                <div className="flex relative">
                  <Input
                    placeholder="Type your tracking id here"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    onBlur={handleTrackingIdChange}
                  />
                  <button
                    type="button"
                    className="absolute right-0 h-full inline-flex items-center  pr-2 cursor-pointer"
                  >
                    <Search size={16} />
                  </button>
                </div>
              </div>

              <div>
                <Label className="mb-2 text-sm">Type here to search</Label>
                <div className="flex relative">
                  <Input
                    placeholder="Type here to search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onBlur={handleSearchChange}
                  />
                  <button
                    type="button"
                    className="absolute right-0 h-full inline-flex items-center  pr-2 cursor-pointer"
                  >
                    <Search size={16} />
                  </button>
                </div>
              </div>

              <div>
                <Label className="mb-2 text-sm">Select a parcel status</Label>
                <Select
                  onValueChange={handleParcelStatusChange}
                  defaultValue={searchParams.get("status") || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {Object.values(ParcelStatus).map((status) => (
                      <SelectItem value={status} key={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 text-sm">Select a parcel type</Label>
                <Select
                  onValueChange={handleParcelTypeChange}
                  defaultValue={searchParams.get("type") || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a parcel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {Object.values(ParcelTypes).map((type) => (
                      <SelectItem value={type} key={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 text-sm">Select sort field</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select onValueChange={setSortItem} value={sortItem}>
                    <SelectTrigger className="w-full col-span-2">
                      <SelectValue placeholder="Select a sort item" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Sorting Items</SelectLabel>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="rent">Parcel Rent</SelectItem>
                        <SelectItem value="weight">Parcel Weight</SelectItem>
                        <SelectItem value="status">Parcel Status</SelectItem>
                        <SelectItem value="type">Parcel Type</SelectItem>
                        <SelectItem value="createdAt">Parcel Date</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={setSortType} value={sortType}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Sorting Types</SelectLabel>
                        <SelectItem value="ascending">Ascending</SelectItem>
                        <SelectItem value="descending">Descending</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-end gap-3 items-end">
                <Button
                  variant="outline"
                  className="flex-1 lg:flex-none"
                  onClick={clearFilters}
                >
                  <Trash2Icon /> Clear All Filters
                </Button>
                <Button
                  className="flex-1 lg:flex-none"
                  type="submit"
                  variant={"secondary"}
                >
                  Submit
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======= Toggle Button ======= */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={() => setOpen((prev) => !prev)}
          variant="outline"
          className="relative inline-flex items-center gap-2 px-5 py-2"
        >
          {/* Icon animations */}
          <motion.div
            key={open ? "close" : "search"}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <XIcon /> : <SearchIcon />}
          </motion.div>

          {/* Text animations */}
          <motion.span
            key={open ? "close-txt" : "open-txt"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {open ? "Close Filters" : "Open Filters"}
          </motion.span>
        </Button>
      </div>
    </div>
  );
}
