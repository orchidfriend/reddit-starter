//Starter Project for the Reddit Clone
var app = angular.module('reddit-clone', ['ngRoute', 'firebase']);

app.constant('fbURL','https://redditclone-test1.firebaseio.com/');

app.factory('Posts',function($firebaseArray, fbURL){
    //return $firebase(new Firebase(fbURL)).$asArray();
    return $firebaseArray(new Firebase(fbURL));
});

app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            controller: 'MainController',
            templateUrl: 'main.html'
        })
        .otherwise ({
            redirectTo: '/'
        });
});

app.controller('MainController', function($scope, $firebaseArray, Posts){

    $scope.posts = Posts;

    $scope.savePost = function(post) {
        if (!$scope.authData) {
            alert("Please login first!");
            return;
        }
        if (!post||!post.name || !post.description || !post.url) {
            alert("You need to fill all the fields!");
            return;
        }
        Posts.$add({
            name: post.name,
            description: post.description,
            url: post.url,
            votes: 0,
            user: $scope.authData.twitter.username
        });

        post.name = "";
        post.description = "";
        post.url = "";
    };

    $scope.addVote = function(post) {
        post.votes++;
        Posts.$save(post);
    };

    $scope.deletePost = function(post) {
        var postForDeletion = new Firebase('https://redditclone-test1.firebaseio.com/'+post.$id);
        postForDeletion.remove();
    };

    $scope.addComments = function(post, newComment) {
        if (!$scope.authData) {
            alert("Please log in!");
            return;
        }
        var refForAddComments = new Firebase('https://redditclone-test1.firebaseio.com/'+post.$id+'/comments');
        $scope.comments = $firebaseArray(refForAddComments);
        $scope.comments.$add({
            user: $scope.authData.twitter.username,
            text: newComment.txt
        });
        newComment.txt = "";
    };

    $scope.deleteComment = function (post, comment) {
        var commentToDelete = new Firebase('https://redditclone-test1.firebaseio.com/'+post.$id+'/comments/'+comment.$id);
        commentToDelete.remove();
    };

    $scope.login = function() {
        var ref = new Firebase('https://redditclone-test1.firebaseio.com/');
        ref.authWithOAuthPopup('twitter',function(error, authData){
            if (error) {
                alert('Sorry, we have some problem on authentication. Please try again!');
            } else {
                alert('Success!');
            }
            $scope.authData = authData;
        });
    };
});
