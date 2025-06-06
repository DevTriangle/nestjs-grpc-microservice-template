import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { AppServiceClient as _main_AppServiceClient, AppServiceDefinition as _main_AppServiceDefinition } from './main/AppService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  Empty: MessageTypeDefinition
  main: {
    AppService: SubtypeConstructor<typeof grpc.Client, _main_AppServiceClient> & { service: _main_AppServiceDefinition }
    ServiceStatus: MessageTypeDefinition
  }
}

