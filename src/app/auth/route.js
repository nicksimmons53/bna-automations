'use server'

import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

const SECRET = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_SECRET;
const CLIENT_ID = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID;

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

  let res = await client.send(command);

  if (res.AuthenticationResult.AccessToken) {
    cookies().set("accessToken", res.AuthenticationResult.AccessToken);
    await redirect("/dashboard")
  }

  return res;
}

const finishAuth = async() => {
  cookies().delete("accessToken");
  await redirect("/login");
}

export { initiateAuth, finishAuth };