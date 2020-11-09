# coding=utf-8
#####################################################
# THIS FILE IS AUTOMATICALLY GENERATED. DO NOT EDIT #
#####################################################
# noqa: E128,E201
from ..client import BaseClient
from ..client import createApiClient
from ..client import config
from ..client import createTemporaryCredentials
from ..client import createSession
_defaultConfig = config


class Object(BaseClient):
    """
    The object service provides HTTP-accessible storage for large blobs of data.
    """

    classOptions = {
    }
    serviceName = 'object'
    apiVersion = 'v1'

    def ping(self, *args, **kwargs):
        """
        Ping Server

        Respond without doing anything.
        This endpoint is used to check that the service is up.

        This method is ``stable``
        """

        return self._makeApiCall(self.funcinfo["ping"], *args, **kwargs)

    def uploadObject(self, *args, **kwargs):
        """
        Upload backend data

        Upload backend data.

        This method is ``experimental``
        """

        return self._makeApiCall(self.funcinfo["uploadObject"], *args, **kwargs)

    funcinfo = {
        "ping": {
            'args': [],
            'method': 'get',
            'name': 'ping',
            'route': '/ping',
            'stability': 'stable',
        },
        "uploadObject": {
            'args': ['name'],
            'input': 'v1/upload-object-request.json#',
            'method': 'post',
            'name': 'uploadObject',
            'route': '/upload/<name>',
            'stability': 'experimental',
        },
    }


__all__ = ['createTemporaryCredentials', 'config', '_defaultConfig', 'createApiClient', 'createSession', 'Object']
