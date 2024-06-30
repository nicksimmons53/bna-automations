'use client'

// import { authenticate } from "@/app/lib/actions";
import {Button, Divider, Input} from "@nextui-org/react";
import {useForm, Controller} from "react-hook-form";
import {signIn} from "next-auth/react";
import {initiateAuth} from "@/app/lib/actions/authenticate";

export default function Page() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "nick.simmons",
      password: "Miles0812!"
    }
  });

  const onSubmit = async(data) => {
    let res = await initiateAuth(data);
    console.log(res);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={"flex flex-col h-screen justify-center items-center"}>
        <div className={"w-1/4"}>
          <h1>BNA Automations</h1>
          <Divider />
          <Controller
            name={"username"}
            control={control}
            render={({ field }) => (<Input label={"Username"} className={"my-2"} {...field}/>)}
          />
          <Controller
            name={"password"}
            control={control}
            render={({ field }) => (<Input label={"Password"} className={"my-2"} {...field}/>)}
          />
          <Button
            className={"my-2"}
            type={"submit"}
            color={"primary"}
          >
            Login
          </Button>
        </div>
        </div>
    </form>
  );
}
