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

    $scope.init();

});