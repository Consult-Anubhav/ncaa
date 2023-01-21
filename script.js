var app = angular.module('ncaa', []);
app.controller('ncaaController', function($scope, $http) {
    
    $scope.data = [];
    $scope.max_colors = 0;

    $scope.init = function()
    {
        $("#overlay").fadeIn();
        $http.get('https://new-azfn-draftsy.azurewebsites.net/api/NCAAcolors?code=Eto4jJQkBLIbJV0fVO8Z6RFOwIr83z7fKkhfImXuVaQmwrg7jbLLgA==')
            .then(function (response)
            {
                response.data.Output.forEach(ele => {
                    if ($scope.max_colors < ele.teamColorCodes.length)
                        $scope.max_colors = ele.teamColorCodes.length;
                });

                $scope.data = response.data.Output;

                $("#overlay").fadeOut();
            })
            .catch(function ()
            {
                $("#overlay").fadeOut();
            });
    };

    $scope.getColor = function()
    {
        return '#000000';
    }

    $scope.init();

});

app.filter('getColor', function() {
    return function(hex) {

        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)

        return (((r * 299) + (g * 587) + (b * 114)) / 1000) >= 128 ? '000' : 'fff';;
    };
});
