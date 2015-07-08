zyApp.controller("zycs", ["$scope", "$location",
function($scope, $location) {

    //$('#example_1').datetimepicker();

    $scope.showUrl=function() {
        var text = "";
        text += $location.u()  ;
        alert(text)
    }
}
]);


