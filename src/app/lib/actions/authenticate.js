'use client'

// import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";
// import { Auth } from "aws-amplify";

import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand
} from "@aws-sdk/client-cognito-identity-provider";
import hmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';

const CryptoJS = require('crypto-js');

const initiateAuth = ({ username, password }) => {
  let hashKey = hmacSHA256(process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_SECRET, username + process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID)
  console.log(hashKey.toString(CryptoJS.enc.Base64));
  const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: Base64.stringify(hmacSHA256(process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_SECRET, username + process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID))
    },
    ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
  });

  return client.send(command);
}

export { initiateAuth };