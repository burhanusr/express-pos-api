class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // advanced filtering (filter mongodb operator)
    let queryStr = JSON.stringify(this.queryString);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|in)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // sorting
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort);
    } else {
      this.query = this.query.sort('_id');
    }

    return this;
  }

  selectFields() {
    // selecting fields
    if (this.queryString.fields) {
      this.query = this.query.select(this.queryString.fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // pagination
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
