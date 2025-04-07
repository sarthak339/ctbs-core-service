module.exports = {
    createPaginatedResponse: function (totalItemCount, page, pageSize, data) {
        let response = {
            content: data,
            pageable: {
                first: page == 1? true : false,
                last: page == parseInt(Math.ceil(totalItemCount / pageSize)) ? true : false,
                pageSize: data.length,
                pageNumber : page
            },
            totalPages: totalItemCount> pageSize ? parseInt(Math.ceil(totalItemCount / pageSize)) : 1,
            totalElements: totalItemCount,
            size: pageSize
        }

        return response;
    }
}