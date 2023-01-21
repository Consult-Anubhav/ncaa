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

    function inverseChannelColour(channelColour){
        return (255 - parseInt(channelColour, 16)).toString(16);
      }

    return function(colour) {
        const r = inverseChannelColour(colour.substring(0,2));
        const g = inverseChannelColour(colour.substring(2,4));
        const b = inverseChannelColour(colour.substring(4,6));
        return r.toString().padStart(2,"0") + g.toString().padStart(2,"0") + b.toString().padStart(2,"0");
    };
});
