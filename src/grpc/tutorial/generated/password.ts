import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { PasswordServiceClient as _tutorial_PasswordServiceClient, PasswordServiceDefinition as _tutorial_PasswordServiceDefinition } from './tutorial/PasswordService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  tutorial: {
    Empty: MessageTypeDefinition
    PasswordDetails: MessageTypeDefinition
    PasswordList: MessageTypeDefinition
    PasswordService: SubtypeConstructor<typeof grpc.Client, _tutorial_PasswordServiceClient> & { service: _tutorial_PasswordServiceDefinition }
  }
}

