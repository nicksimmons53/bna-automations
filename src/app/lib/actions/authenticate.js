'use client'

// import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";
// import { Auth } from "aws-amplify";

import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand
} from "@aws-sdk/client-cognito-identity-provider";
import {decodeFromBase64} from "next/dist/build/webpack/loaders/utils";
import crypto from "crypto";

const SECRET = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_SECRET;
const CLIENT_ID = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID;

// const SECRET = "1ul1a35qlt54oe9tii49ald86ja3b8h77el3bcmg3vat59a0eli";
// const CLIENT_ID = "7g6rq1f6j6685c1m59ljlgi97n";

const initiateAuth = async ({ username, password }) => {
  const hash = crypto
    .createHmac("SHA256", SECRET)
    .update(`${username}${CLIENT_ID}`)
    .digest("base64");

  const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: hash
    },
    ClientId: CLIENT_ID,
  });

  return client.send(command);
}

export { initiateAuth };