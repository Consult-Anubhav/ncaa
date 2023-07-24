var app = angular.module('ncaa', []);
app.controller('ncaaController', function ($scope, $http) {

    $scope.data = [];
    $scope.max_colors = 0;
    $scope.selected_sport = undefined;

    $scope.api = {
        list: 'https://newdraftsytesting.azurewebsites.net/api/NCAASportList?code=-I_Q7hBy_GklGzfdXQHXIXK95bX3z-vfE4GNgbBUoI5-AzFu3SORnw==',
        fetch: 'https://newdraftsytesting.azurewebsites.net/api/NCAAcolors?code=-I_Q7hBy_GklGzfdXQHXIXK95bX3z-vfE4GNgbBUoI5-AzFu3SORnw==',
        save: 'https://newdraftsytesting.azurewebsites.net/api/NCAAColorApproved?code=-I_Q7hBy_GklGzfdXQHXIXK95bX3z-vfE4GNgbBUoI5-AzFu3SORnw=='
    };

    $scope.sports = [];

    $scope.init = function () {
        $("#preloader").fadeIn();
        $http.get($scope.api.list)
            .then(function (response) {
                $scope.sports = response.data;
                $("#preloader").fadeOut();
            })
            .catch(function () {
                $("#preloader").fadeOut();
            });
    };

    $scope.initData = function (sportId = $scope.selected_sport) {
        $("#preloader").fadeIn();
        $http.post($scope.api.fetch, {
            input: [{sportId: sportId}]
        })
            .then(function (response) {
                response.data.Output.forEach(ele => {
                    if ($scope.max_colors < ele.teamColorCodes.length)
                        $scope.max_colors = ele.teamColorCodes.length;

                    let arr = [];

                    ele.teamColorCodes.forEach(color => {
                        if (color !== null)
                            arr.push(color);
                    })

                    ele.teamColorCodes = arr;
                });

                $scope.data = response.data.Output;
                $scope.paginateData($scope.pagination_details.current_page ? $scope.pagination_details.current_page : 1);

                $("#preloader").fadeOut();
            })
            .catch(function () {
                $("#preloader").fadeOut();
            });
    };

    $scope.save = function () {
        $("#preloader").fadeIn();
        let new_data = {};

        new_data.input = [];

        $scope.pre_paginated_data.forEach(ele => {
            if (ele.selection && ele.selection.isselected == true && ele.temp_selected == true)
                new_data.input.push({
                    'teamName': ele.teamName,
                    'textColor': ele.selection.selectedfontColor,
                    'approvedColor': ele.selection.selectedColor,
                    'comment': (ele.comment && ele.comment != '') ? ele.comment : "",
                    'sportId': $scope.selected_sport
                });
        });

        submitData(new_data);

        $("#preloader").fadeOut();
    };

    async function getData(data = {}) {
        fetch($scope.api.fetch, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data),
        }).then((response) => {
            // $('#successModal').modal('show');
        })
            .catch((error) => {
                $('#failureModal').modal('show');
            })
    }

    async function submitData(data = {}) {
        fetch($scope.api.save, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data),
        }).then((response) => {
            $scope.initData();
            $('#successModal').modal('show');
        })
            .catch((error) => {
                $('#failureModal').modal('show');
            })
    }

    $scope.openColorPicker = function (id) {
        $('#' + id).trigger('click');
    }

    $scope.openComment = function (t) {
        $scope.modal_row = t;
        $('#commentModal').modal('show');
    }

    $scope.setApprovedColor = function (team, color) {
        team.selection = {};
        team.selection.isselected = true;
        team.selection.selectedColor = color;
        team.selection.selectedfontColor = contrastColor(color);
        team.temp_selected = true;
    }

    $scope.clearChanges = function (t) {
        t.selection.isselected = false;
        t.selection = t.old_selection;
        t.temp_selected = false;
        $('#commentModal').modal('show');
    }

    $scope.paginated_data = [];
    $scope.pagination_details = {};
    $scope.per_page_filter = 10;
    $scope.currentPage = 1;
    $scope.startPage = 0;
    $scope.endPage = 0;
    $scope.page_size = [10, 25, 50, 100, 250, 500];

    $scope.paginateData = function (page_number = null) {
        $("#preloader").fadeIn();

        if (page_number != null) {
            $scope.pagination_details.current_page = page_number;
        }

        //START - Stack Pointers and Pagination Details updater
        if ($scope.data.length <= $scope.per_page_filter) {
            //IF there is single page
            $scope.pagination_details.last_page = 1;
            $scope.pagination_details.from = 1;
            $scope.pagination_details.to = $scope.data.length;
        } else {
            //IF there are multiple pages
            let remainder = $scope.data.length % $scope.per_page_filter;

            if (remainder === 0) {
                //IF last page is a complete, last page size is equal to per page size
                $scope.pagination_details.last_page = parseInt(($scope.data.length / $scope.per_page_filter));

                //SET index for any of all complete pages
                $scope.pagination_details.to = $scope.per_page_filter * $scope.pagination_details.current_page;
                $scope.pagination_details.from = $scope.pagination_details.to - $scope.per_page_filter + 1;
            } else {
                //IF last page is not a complete, last page size is less than per page size
                $scope.pagination_details.last_page = parseInt(($scope.data.length / $scope.per_page_filter)) + 1;

                if ($scope.pagination_details.current_page < $scope.pagination_details.last_page) {
                    //SET index for any of complete pages except last page
                    $scope.pagination_details.to = $scope.per_page_filter * $scope.pagination_details.current_page;
                    $scope.pagination_details.from = $scope.pagination_details.to - $scope.per_page_filter + 1;
                } else {
                    //SET index for last page
                    $scope.pagination_details.to = ($scope.per_page_filter * ($scope.pagination_details.current_page - 1)) + remainder;
                    $scope.pagination_details.from = $scope.pagination_details.to - remainder + 1;
                }
            }
        }
        //END - Stack Pointers and Pagination Details updater

        //SET dropdown for all pages
        $scope.all_pages = [];

        for (let i = 1; i <= $scope.pagination_details.last_page; i++) {
            $scope.all_pages.push(i);
        }

        //SET marked or paginated array to the table
        $scope.pre_paginated_data = $scope.data.slice($scope.pagination_details.from - 1, $scope.pagination_details.to);

        $scope.pre_paginated_data.forEach((ele1, index1) => {
            ele1.old_selection = ele1.selection;
            ele1.teamColorCodes.forEach((ele2, index2) => {
                $scope.pre_paginated_data[index1].teamColorCodes[index2] = '#' + ele2.replace('#', '').substring(0, 6);
            });
        });

        $scope.paginated_data = [];

        $scope.pre_paginated_data.forEach(ele => {
            $scope.paginated_data.push(ele);
        });

        //START - Pagination Links for medium size screen
        $scope.pages = [];

        if ($scope.pagination_details.last_page <= 5) {
            // less than 10 total pages so show all
            $scope.startPage = 1;
            $scope.endPage = $scope.pagination_details.last_page;
        } else {
            // more than 10 total pages so calculate start and end pages
            if ($scope.pagination_details.current_page <= 3) {
                $scope.startPage = 1;
                $scope.endPage = 5;
            } else if ($scope.pagination_details.current_page + 2 >= $scope.pagination_details.last_page) {
                $scope.startPage = $scope.pagination_details.last_page - 4;
                $scope.endPage = $scope.pagination_details.last_page;
            } else {
                $scope.startPage = $scope.pagination_details.current_page - 2;
                $scope.endPage = $scope.pagination_details.current_page + 2;
            }
        }

        for (let i = $scope.startPage; i <= $scope.endPage; i++) {
            $scope.pages.push(i);
        }
        //END - Pagination Links for medium size screen

        //START - Pagination Links for large size screen
        $scope.pages_more = [];

        let startPage_more;
        let endPage_more;
        if ($scope.pagination_details.last_page <= 9) {
            // less than 10 total pages so show all
            startPage_more = 1;
            endPage_more = $scope.pagination_details.last_page;
        } else {
            // more than 10 total pages so calculate start and end pages
            if ($scope.pagination_details.current_page <= 5) {
                startPage_more = 1;
                endPage_more = 9;
            } else if ($scope.pagination_details.current_page + 4 >= $scope.pagination_details.last_page) {
                startPage_more = $scope.pagination_details.last_page - 8;
                endPage_more = $scope.pagination_details.last_page;
            } else {
                startPage_more = $scope.pagination_details.current_page - 4;
                endPage_more = $scope.pagination_details.current_page + 4;
            }
        }

        for (let i = startPage_more; i <= endPage_more; i++) {
            $scope.pages_more.push(i);
        }
        //END - Pagination Links for large size screen

        $("#preloader").fadeOut();
    };

    $scope.calcCursorPage = function (divisor) {
        let dividend = $scope.pagination_details.from - 1;

        $scope.paginateData(Math.floor(dividend / divisor) + 1);
    };

    $scope.init();
});

function inverseChannelColour(channelColour) {
    return (255 - parseInt(channelColour, 16)).toString(16);
}

function contrastColor(color_init) {
    var lightColor = "#FFFFFF", darkColor = "000000";
    var color = color_init.replace('#', '');
    // var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    var uicolors = [r / 255, g / 255, b / 255];
    var c = uicolors.map((col) => {
        if (col <= 0.03928) {
            return col / 12.92;
        }
        return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
    return (L > 0.179) ? darkColor : lightColor;
}

app.filter('getContrastColor', function () {

    return function (colour) {
        return contrastColor(colour);
    };
});
