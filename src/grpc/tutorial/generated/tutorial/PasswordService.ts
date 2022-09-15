// Original file: src/grpc/tutorial/proto/password.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Empty as _tutorial_Empty, Empty__Output as _tutorial_Empty__Output } from '../tutorial/Empty';
import type { PasswordDetails as _tutorial_PasswordDetails, PasswordDetails__Output as _tutorial_PasswordDetails__Output } from '../tutorial/PasswordDetails';
import type { PasswordList as _tutorial_PasswordList, PasswordList__Output as _tutorial_PasswordList__Output } from '../tutorial/PasswordList';

export interface PasswordServiceClient extends grpc.Client {
  AddNewDetails(argument: _tutorial_PasswordDetails, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  AddNewDetails(argument: _tutorial_PasswordDetails, metadata: grpc.Metadata, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  AddNewDetails(argument: _tutorial_PasswordDetails, options: grpc.CallOptions, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  AddNewDetails(argument: _tutorial_PasswordDetails, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  addNewDetails(argument: _tutorial_PasswordDetails, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  addNewDetails(argument: _tutorial_PasswordDetails, metadata: grpc.Metadata, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  addNewDetails(argument: _tutorial_PasswordDetails, options: grpc.CallOptions, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  addNewDetails(argument: _tutorial_PasswordDetails, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  
  RetrievePasswords(argument: _tutorial_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_tutorial_PasswordList__Output>): grpc.ClientUnaryCall;
  RetrievePasswords(argument: _tutorial_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_tutorial_PasswordList__Output>): grpc.ClientUnaryCall;
  RetrievePasswords(argument: _tutorial_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_tutorial_PasswordList__Output>): grpc.ClientUnaryCall;
  RetrievePasswords(argument: _tutorial_Empty, callback: grpc.requestCallback<_tutorial_PasswordList__Output>): grpc.ClientUnaryCall;
  retrievePasswords(argument: _tutorial_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_tutorial_PasswordList__Output>): grpc.ClientUnaryCall;
  retrievePasswords(argument: _tutorial_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_tutorial_PasswordList__Output>): grpc.ClientUnaryCall;
  retrievePasswords(argument: _tutorial_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_tutorial_PasswordList__Output>): grpc.ClientUnaryCall;
  retrievePasswords(argument: _tutorial_Empty, callback: grpc.requestCallback<_tutorial_PasswordList__Output>): grpc.ClientUnaryCall;
  
  UpdatePasswordDetails(argument: _tutorial_PasswordDetails, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  UpdatePasswordDetails(argument: _tutorial_PasswordDetails, metadata: grpc.Metadata, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  UpdatePasswordDetails(argument: _tutorial_PasswordDetails, options: grpc.CallOptions, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  UpdatePasswordDetails(argument: _tutorial_PasswordDetails, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  updatePasswordDetails(argument: _tutorial_PasswordDetails, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  updatePasswordDetails(argument: _tutorial_PasswordDetails, metadata: grpc.Metadata, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  updatePasswordDetails(argument: _tutorial_PasswordDetails, options: grpc.CallOptions, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  updatePasswordDetails(argument: _tutorial_PasswordDetails, callback: grpc.requestCallback<_tutorial_PasswordDetails__Output>): grpc.ClientUnaryCall;
  
}

export interface PasswordServiceHandlers extends grpc.UntypedServiceImplementation {
  AddNewDetails: grpc.handleUnaryCall<_tutorial_PasswordDetails__Output, _tutorial_PasswordDetails>;
  
  RetrievePasswords: grpc.handleUnaryCall<_tutorial_Empty__Output, _tutorial_PasswordList>;
  
  UpdatePasswordDetails: grpc.handleUnaryCall<_tutorial_PasswordDetails__Output, _tutorial_PasswordDetails>;
  
}

export interface PasswordServiceDefinition extends grpc.ServiceDefinition {
  AddNewDetails: MethodDefinition<_tutorial_PasswordDetails, _tutorial_PasswordDetails, _tutorial_PasswordDetails__Output, _tutorial_PasswordDetails__Output>
  RetrievePasswords: MethodDefinition<_tutorial_Empty, _tutorial_PasswordList, _tutorial_Empty__Output, _tutorial_PasswordList__Output>
  UpdatePasswordDetails: MethodDefinition<_tutorial_PasswordDetails, _tutorial_PasswordDetails, _tutorial_PasswordDetails__Output, _tutorial_PasswordDetails__Output>
}
