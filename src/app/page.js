"use client";

import React from "react";
import styles from "./page.module.css";
import {Button, Divider, Input, Select, SelectItem, Spinner, Textarea} from "@nextui-org/react";
import useSWR from "swr";
import {useForm, Controller} from "react-hook-form";
import axios from "axios";

// const titles = ["Dealer", "Distributor", "Customer", "Service"];
// const industries = [
//   "Food Safety", "Beverage", "Dentistry", "Healthcare", "Pet Grooming", "Professional Laundry", "Professional Cleaning",
//   "Professional Ozone Applications", "Hydrogen Home Applications", "Disinfection Home Applications", "Other"
// ];

const fetcher = (url) => fetch(`${url}`).then(r => r.json())
const useGetAsanaUsers = () => {
  const { data, error, isLoading } = useSWR("https://automations.api.e-o3.com/asana/users", fetcher);

  return {
    asanaUsers: data,
    isLoading,
    isError: error,
  };
}

export default function Home() {
  const { asanaUsers, isLoading, isError } = useGetAsanaUsers();
  const [pushDataActive, setPushDataActive] = React.useState(false);
  const [leadText, setLeadText] = React.useState("");
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      "Name": "",
      "Industry": "",
      "Email": "",
      "Country": "",
      "Phone Number": "",
      "Title": "",
      "Notes": "",
      "Company": "",
      "asanaUser": "",
      "asanaTaskName": "",
      "hubspotLifecycleStage": "",
      "userName": ""
    }
  });

  const pullLeadData = () => {
    let data = leadText.split("\n");

    data.forEach((attr, index) => {
      if (attr.split(":").length === 1) {
        setValue("Notes", attr);
      } else {
        let splitAttr = attr.split(":");
        setValue(splitAttr[0], splitAttr[1].trim());
      }
    });

    setPushDataActive(true);
  }

  const clearData = () => {
    setLeadText("");
    setValue("asanaUser", "");
    reset();
    setPushDataActive(false);
  }

  const onSubmit = (data) => {
    let newData = {
      ...data,
      asanaTaskName: `${data.Industry} - ${data.Name}`,
      hubspotLifecycleStage: "New",
    };

    // Create asana task
    axios.post('https://automations.api.e-o3.com/asana/tasks', newData)
      .then(res => console.log(res))
      .catch(e => console.error(e));

    // Create hubspot contact
    axios.post('https://automations.api.e-o3.com/hubspot/contacts', newData)
      .then(res => console.log(res))
      .catch(e => console.error(e));

    setPushDataActive(false);
    reset();
  }

  if (!asanaUsers) {
    return (
      <div className={"flex h-screen justify-center items-center"}>
        <Spinner />
      </div>
    )
  }

  return (
    <main className={styles.main}>
      <div className={"md:w-1/2 sm:w-full xs:w-full"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>BES to BNA Lead Conversion</h2>
          <Divider />
          <Textarea
            label="Lead to Convert"
            placeholder="Copy and paste lead information here"
            className={"my-2"}
            minRows={8}
            value={leadText}
            onValueChange={setLeadText}
          />
          <Button
            className={"my-2"}
            color={"primary"}
            onClick={pullLeadData}>
            Autofill
          </Button>

          <Divider className={"my-2"} />

          <h2>Populated Information</h2>
          <Controller
            name={"Name"}
            control={control}
            render={({ field }) => <Input label={"Name"} className={"my-2"} {...field} />}
          />
          <Controller
            name={"Title"}
            control={control}
            render={({ field }) => <Input label={"Title"} className={"my-2"} {...field} />}
          />
          <Controller
            name={"Industry"}
            control={control}
            render={({ field }) => <Input label={"Industry"} className={"my-2"} {...field} />}
          />
          <Controller
            name={"Phone Number"}
            control={control}
            render={({ field }) => <Input label={"Phone Number"} className={"my-2"} {...field} />}
          />
          <Controller
            name={"Email"}
            control={control}
            render={({ field }) => <Input label={"Email"} className={"my-2"} {...field} />}
          />
          <Controller
            name={"Country"}
            control={control}
            render={({ field }) => <Input label={"Country"} className={"my-2"} {...field} />}
          />
          <Controller
            name={"Company"}
            control={control}
            render={({ field }) => <Input label={"Company"} className={"my-2"} {...field} />}
          />
          <Controller
            name={"asanaUser"}
            control={control}
            render={({ field }) => (
              <Select
                items={asanaUsers.data}
                label="Assigned Asana User"
                placeholder="Select a user"
                className="max-w-s"
                {...field}
              >
                {(user) => <SelectItem key={user.gid} value={user.gid}>{user.name}</SelectItem>}
              </Select>
            )}
          />
          <Controller
            name={"Notes"}
            control={control}
            render={({ field }) => <Textarea label={"Notes"} placeholder={""} className={"my-2"} minRows={4} {...field}/>}
          />

          <Button
            className={"mr-2 my-2"}
            type={"submit"}
            color={pushDataActive ? "primary" : "default"}
            disabled={!pushDataActive}
          >
            Submit Data
          </Button>
          <Button className={"m-2"} color={"danger"} onClick={clearData}>Clear Data</Button>
        </form>
      </div>
    </main>
  );
}
