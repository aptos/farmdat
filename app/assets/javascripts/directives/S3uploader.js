var aws = angular.module('aws', []);

aws.directive('awsUploader',[ '$http', function ($http) {
  return {
    restrict:'A',
    require:'ngModel',
    link:function (scope, element, attrs, ngModel) {
      var folder = 'uploads';
      var browse_button = attrs.browseButton || 'addFile';
      var progress = {
        start: function (file) {
          scope.progressVisible = true;
          scope.progress = file.percent;
        },
        finish: function () {
          scope.progressVisible = false;
          scope.progress = 0;
        }
      };

      var upload = function () {
        // create folder name at upload time, supports function to return dynamic folder name
        if (attrs.folder) folder = scope.$eval(attrs.folder);

        $http({ method: 'GET', url: 'signed_url', params: {folder: folder} }).
        success(function (data) {
          params = {
            key: data.key,
            policy: data.policy,
            signature: data.signature,
            AWSAccessKeyId: data.access_key,
            bucket: data.bucket
          };
          scope.bucket_url = 'https://' + data.bucket + ".s3.amazonaws.com/";
          scope.aws_uploader.start();
        }).
        error(function(data, status, headers, config){
          console.error(data.error);
        });
        $('#loading').show();
      };

      scope.aws_uploader = new plupload.Uploader({
        runtimes:'html5,html4',
        multiple_queues: true,
        max_file_size:'10mb',
        multipart: true,
        browse_button: attrs.browseButton,
        preinit: {
          UploadFile: function (up, file) {
            up.settings.url = scope.bucket_url;
            up.settings.multipart_params = {
              key: params['key'],
              AWSAccessKeyId: params['AWSAccessKeyId'],
              acl: 'public-read',
              policy: params["policy"],
              signature: params["signature"],
              success_action_status: '201'
            };
          }
        }
      });

      if (attrs.resize) {
        scope.aws_uploader.settings.resize = scope.$eval(attrs.resize);
        console.info("file resized", scope.$eval(attrs.resize) );
      }

      scope.aws_uploader.init();

      scope.aws_uploader.bind('FilesAdded', function (up, files) {
        // upload immediately on file add
        upload();
      });

      scope.aws_uploader.bind('UploadProgress', function(up, file) {
        progress.start(file);
        scope.$safeApply();
      });

      scope.aws_uploader.bind('FileUploaded', function (up, file, response) {
        $('#loading').hide();
        progress.finish();
        var s3_uri = $(response.response).find('Location').text();
        ngModel.$setViewValue(s3_uri);
        scope.filename = ngModel.$viewValue;
        scope.$apply();
      });

      scope.aws_uploader.bind('Error', function (up, error) {
        console.info(error);
        $('#loading').hide();
        scope.$apply();
      });
    },
    template: '<div class="upload-wrap">' +
    '<button id="addDocument" class="btn btn-primary" type="button"><span ng-if="!filename">Choose Photo</span><span ng-if="filename">Replace Photo</span></button>' +
    '<div class="progress" ng-show="progressVisible" style="margin-top: 10px">' +
    '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: {{ progress }}%;">' +
    '<span class="sr-only">{{ progress }}% Complete (success)</span>' +
    '</div>' +
    '</div>' +
    '<input type="file" style="display: none"/>' +
    '</div>'
  };
}]);
