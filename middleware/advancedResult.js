const advancedResult = (modle, populate) => async (req, res, next) => {

    let query

    let reqQuery = {...req.query}

    let queryStr = JSON.stringify(reqQuery)

    const removeField = ['search', 'sort', 'page', 'limit']

    removeField.forEach(param => delete reqQuery[param])

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

    query = modle.find(JSON.parse(queryStr))

    if(req.query.search) {
        const searchField = req.query.search.split(',').join(' ')
        query = query.select(searchField)
    }

    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }

    const page = parseInt(req.query.page, 10) || 1

    const limit = parseInt(req.query.limit, 10) || 4

    const startIndex = (page - 1) * limit

    const endIndex = page * limit

    const total = await modle.countDocuments()

    query = query.skip(startIndex).limit(limit)

    if(populate) {
        query = query.populate(populate)
    }

    const results = await query

    const pagination = {}

    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0 ) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResult = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next()
}

module.exports = advancedResult