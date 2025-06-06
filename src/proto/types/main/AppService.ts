// Original file: src/proto/main.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Empty as _Empty, Empty__Output as _Empty__Output } from '../Empty';
import type { ServiceStatus as _main_ServiceStatus, ServiceStatus__Output as _main_ServiceStatus__Output } from '../main/ServiceStatus';

export interface AppServiceClient extends grpc.Client {
  GetStatus(argument: _Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_main_ServiceStatus__Output>): grpc.ClientUnaryCall;
  GetStatus(argument: _Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_main_ServiceStatus__Output>): grpc.ClientUnaryCall;
  GetStatus(argument: _Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_main_ServiceStatus__Output>): grpc.ClientUnaryCall;
  GetStatus(argument: _Empty, callback: grpc.requestCallback<_main_ServiceStatus__Output>): grpc.ClientUnaryCall;
  getStatus(argument: _Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_main_ServiceStatus__Output>): grpc.ClientUnaryCall;
  getStatus(argument: _Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_main_ServiceStatus__Output>): grpc.ClientUnaryCall;
  getStatus(argument: _Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_main_ServiceStatus__Output>): grpc.ClientUnaryCall;
  getStatus(argument: _Empty, callback: grpc.requestCallback<_main_ServiceStatus__Output>): grpc.ClientUnaryCall;
  
}

export interface AppServiceHandlers extends grpc.UntypedServiceImplementation {
  GetStatus: grpc.handleUnaryCall<_Empty__Output, _main_ServiceStatus>;
  
}

export interface AppServiceDefinition extends grpc.ServiceDefinition {
  GetStatus: MethodDefinition<_Empty, _main_ServiceStatus, _Empty__Output, _main_ServiceStatus__Output>
}
