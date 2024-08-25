'use client'

import {Button, Divider, Input} from "@nextui-org/react";
import {useForm, Controller} from "react-hook-form";
import {changePassword, initiateAuth} from "@/app/auth/route";
import {CognitoIdentityProviderClient, RespondToAuthChallengeCommand} from "@aws-sdk/client-cognito-identity-provider";

const CLIENT_ID = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID;

export default function Page() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      previousPassword: "",
      newPassword: "",
      newConfirmedPassword: "",
    }
  });

  const onSubmit = async(data ) => {
    let res = await changePassword({
      username: data.username,
      newPassword: data.newConfirmedPassword
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={"flex flex-col h-screen justify-center items-center"}>
        <div className={"w-1/4"}>
          <h1>Password Reset</h1>
          <Divider />
          <Controller
            name={"username"}
            control={control}
            render={({ field }) => (
              <Input label={"Username"} className={"my-2"} {...field}/>
            )}
          />
          <Controller
            name={"previousPassword"}
            control={control}
            render={({ field }) => (
              <Input label={"Old Password"} className={"my-2"} {...field}/>
            )}
          />
          <Controller
            name={"newPassword"}
            control={control}
            render={({ field }) => (
              <Input label={"New Password"} className={"my-2"} {...field}/>
            )}
          />
          <Controller
            name={"newConfirmedPassword"}
            control={control}
            render={({ field }) => (
              <Input label={"Confirm New Password"} className={"my-2"} {...field}/>
            )}
          />
          <Button
            className={"my-2"}
            type={"submit"}
            color={"primary"}
          >
            Set Password
          </Button>
        </div>
      </div>
    </form>
  );
}
