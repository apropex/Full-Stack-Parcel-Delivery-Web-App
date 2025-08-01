"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    constructor(rawModel, query) {
        this.searchQuery = {};
        this.filters = {};
        this.rawModel = rawModel;
        this.model = this.rawModel.find();
        this.query = query;
    }
    getFilters() {
        var _a;
        const exclude = ["search", "sort", "fields", "page", "limit"];
        this.filters = Object.fromEntries(Object.entries((_a = this.query) !== null && _a !== void 0 ? _a : {}).filter(([key]) => !exclude.includes(key)));
    }
    getSearchQuery(searchableFields) {
        var _a, _b;
        const search = ((_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.search) === null || _b === void 0 ? void 0 : _b.trim()) || "";
        this.searchQuery = {
            $or: searchableFields.map((field) => ({
                [field]: { $regex: search, $options: "i" },
            })),
        };
    }
    filter() {
        this.getFilters();
        this.model = this.model.find(this.filters);
        return this;
    }
    search(searchableFields) {
        this.getSearchQuery(searchableFields);
        this.model = this.model.find(this.searchQuery);
        return this;
    }
    sort() {
        var _a;
        const sort = ((_a = this.query) === null || _a === void 0 ? void 0 : _a.sort) || "-createdAt";
        this.model = this.model.sort(sort);
        return this;
    }
    select() {
        var _a, _b;
        const fields = ((_b = (_a = this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(",").join(" ")) || "";
        this.model = this.model.select(fields);
        return this;
    }
    paginate() {
        var _a, _b;
        const page = Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this.query) === null || _b === void 0 ? void 0 : _b.limit) || 12;
        const skip = (page - 1) * limit;
        this.model = this.model.skip(skip).limit(limit);
        return this;
    }
    meta(searchableFields) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.getSearchQuery(searchableFields);
            this.getFilters();
            const filterQuery = Object.assign(Object.assign({}, this.searchQuery), this.filters);
            const page = Math.max(Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.page) || 1, 1);
            const limit = Math.max(Number((_b = this.query) === null || _b === void 0 ? void 0 : _b.limit) || 12, 1);
            const skip = (page - 1) * limit;
            const [filteredCount, totalDataCount] = yield Promise.all([
                this.rawModel.countDocuments(filterQuery),
                this.rawModel.estimatedDocumentCount(),
            ]);
            const ls = limit + skip;
            // const isFiltered = filteredCount !== totalDataCount;
            return {
                total_data: totalDataCount,
                filtered_data: filteredCount,
                present_data: filteredCount > ls ? limit : filteredCount - skip,
                total_page: Math.ceil(filteredCount / limit),
                present_page: page,
                skip,
                limit: limit,
            };
        });
    }
    build() {
        return this.model;
    }
}
exports.QueryBuilder = QueryBuilder;
