export class ApiFeatures {
  constructor(mongooseQuery, searchQuery) {
    this.mongooseQuery = mongooseQuery;
    this.searchQuery = searchQuery;
  }

  pagination() {
    const pageNumber = this.searchQuery.page * 1 || 1;
    if (this.searchQuery.page < 0) pageNumber = 1;
    3;
    const limit = 2;
    const skip = (pageNumber - 1) * limit;
    this.pageNumber = pageNumber;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }

  filter() {
    let filterObj = structuredClone(this.searchQuery);
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(/(gte|gt|lte|lt)/g, (value) => `$${value}`);
    filterObj = JSON.parse(filterObj);

    let excludedFields = ["page", "sort", "fields", "search"];
    excludedFields.forEach((el) => delete filterObj[el]);
    this.mongooseQuery.find(filterObj);
    return this;
  }

  sort() {
    if (this.searchQuery.sort) {
      const sortBy = this.searchQuery.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortBy);
    }
    return this;
  }

  fields() {
    if (this.searchQuery.fields) {
      const selectedFields = this.searchQuery.fields.split(",").join(" ");
      this.mongooseQuery.select(selectedFields);
    }
    return this;
  }

  search() {
    if (this.searchQuery.search) {
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.searchQuery.search, $options: "i" } },
          { description: { $regex: this.searchQuery.search, $options: "i" } },
        ],
      });
    }
    return this;
  }
}
