
function paginateData(list, data, page_number = null)
{
    if (page_number != null)
    {
        data.current_page = page_number;
    }

    //START - Stack Pointers and Pagination Details updater
    if (list.length <= data.per_page)
    {
        //IF there is single page
        data.last_page = 1;
        data.from = 1;
        data.to = list.length;
    } else
    {
        //IF there are multiple pages
        let remainder = list.length % data.per_page;

        if (remainder === 0)
        {
            //IF last page is a complete, last page size is equal to per page size
            data.last_page = parseInt((list.length / data.per_page));

            //SET index for any of all complete pages
            data.to = data.per_page * data.current_page;
            data.from = data.to - data.per_page + 1;
        } else
        {
            //IF last page is not a complete, last page size is less than per page size
            data.last_page = parseInt((list.length / data.per_page)) + 1;

            if (data.current_page < data.last_page)
            {
                //SET index for any of complete pages except last page
                data.to = data.per_page * data.current_page;
                data.from = data.to - data.per_page + 1;
            } else
            {
                //SET index for last page
                data.to = (data.per_page * (data.current_page - 1)) + remainder;
                data.from = data.to - remainder + 1;
            }
        }
    }
    //END - Stack Pointers and Pagination Details updater
    return data;
}

function calcCursorPage(list, data, divisor)
{
    let dividend = data.from - 1;
    let remainder = list.length % divisor;
    let last_page = (list.length > divisor) ? ((remainder === 0) ? parseInt(list.length / divisor) : parseInt(list.length / divisor) + 1) : 1;
    let page_number = Math.floor(dividend / divisor) + 1;

    return paginateData(list, data, (page_number > last_page) ? last_page : page_number);
}
