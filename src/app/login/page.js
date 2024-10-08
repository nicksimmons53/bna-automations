'use client'

import {Button, Divider, Input} from "@nextui-org/react";
import {useForm, Controller} from "react-hook-form";
import {initiateAuth} from "@/app/auth/route";


export default function Page() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const onSubmit = async(data) => {
    let res = await initiateAuth(data);
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
            render={({ field }) => (
              <Input label={"Username"} className={"my-2"} {...field}/>
            )}
          />
          <Controller
            name={"password"}
            control={control}
            render={({ field }) => (
              <Input label={"Password"} className={"my-2"} {...field} type={"password"}/>
            )}
          />
          {/*<Button*/}
          {/*  className={"my-2 mx-1"}*/}
          {/*  color={"warning"}*/}
          {/*  variant={"bordered"}*/}
          {/*>*/}
          {/*  Reset Password*/}
          {/*</Button>*/}
          <Button
            className={"my-2 mx-1"}
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
