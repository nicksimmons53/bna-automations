"use client";

import React from "react";
import styles from "./page.module.css";
import {Button, Divider, Input, Select, SelectItem, Spinner, Textarea} from "@nextui-org/react";
import useSWR from "swr";
import {useForm, Controller} from "react-hook-form";
import axios from "axios";

const priorities = [
  { key: "low", label: "Low", value: "LOW" },
  { key: "medium", label: "Medium", value: "MEDIUM" },
  { key: "high", label: "High", value: "HIGH" },
];
const types = [
  { key: "email", label: "Email", value: "EMAIL" },
  { key: "call", label: "Call", value: "CALL" },
  { key: "todo", label: "To-Do", value: "TODO" },
];

const fetcher = (url) => fetch(`${url}`).then(r => r.json())
const useGetHubspotOwners = () => {
  const { data, error, isLoading } = useSWR("https://automations.api.e-o3.com/hubspot/owners", fetcher);

  return {
    hubspotOwners: data,
    isLoading,
    isError: error,
  };
}

function titleCase(str) {
  let splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

export default function Home() {
  const { hubspotOwners, isLoading, isError } = useGetHubspotOwners();
  const [pushDataActive, setPushDataActive] = React.useState(false);
  const [leadText, setLeadText] = React.useState("");
  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: {
      "Name": "",
      "Industry": "",
      "Email": "",
      "Country": "",
      "Region": "",
      "Phone Number": "",
      "Title": "",
      "Notes": "",
      "Company": "",
      "taskSubject": "",
      "hubspotOwnerId": "",
      "taskPriority": "",
      "taskType": ""
    }
  });

  const pullLeadData = () => {
    let data = leadText.split("\n");
    let obj = {};
    let keys = [];
    let values = [];
    data.filter(attr => attr !== "").forEach((attr, index) => {
      if (index % 2 !== 0) {
        values.push(attr);
      } else {
        keys.push(attr);
      }
    });

    keys.forEach((attr, index) => {
      if (attr === "Your Message") {
        let message = leadText.split("Your Message")[1].replace(/^\s+|\s+$/g, '');
        obj[attr] = message;
      } else {
        obj[attr] = values[index];
      }
    });

    setValue("Name", `${obj["First Name"]} ${obj["Last Name"]}`);
    setValue("Industry", titleCase(obj["Industry"]));
    setValue("Email", obj["Email"]);
    setValue("Country", obj["Country"]);
    setValue("Region", obj["Region"]);
    setValue("Phone Number", obj["Phone Number"]);
    setValue("Title", obj["Identity"]);
    setValue("Notes", obj["Your Message"]);
    setValue("Company", obj["Company / Organization"]);

    setPushDataActive(true);
  }

  const clearData = () => {
    reset();
    setPushDataActive(false);
  }

  const onSubmit = (data) => {
    let newData = {
      ...data,
    };
    let contactData = {
      "Email": newData["Email"],
      "Name": newData["Name"],
      "Phone Number": newData["Phone Number"],
      "Company": newData["Company"],
    }
    let taskData = {
      taskBody: newData["Notes"],
      hubspotOwnerId: newData["hubspotOwnerId"],
      taskSubject: newData["taskSubject"],
      taskPriority: newData["taskPriority"].toUpperCase(),
      taskType: newData["taskType"].toUpperCase(),
    }

    // Create hubspot contact
    axios.post('https://automations.api.e-o3.com/hubspot/contacts', contactData)
      .then(res => {
        axios.post('https://automations.api.e-o3.com/hubspot/tasks', {...taskData, contactId: res.data.id})
          .then(res => console.log(res))
          .catch(e => console.error(e));
      })
      .catch(e => console.error(e));

    setPushDataActive(false);
    reset();
  }

  if (!hubspotOwners) {
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
            name={"hubspotOwnerId"}
            control={control}
            render={({ field }) => (
              <Select
                items={hubspotOwners.results}
                label="Assigned Hubspot User"
                placeholder={"Select a user"}
                className="max-w-s my-2"
                selectedKeys={[field.value]}
                onChange={field.onChange}
              >
                {(user) => <SelectItem value={user.email}>{user.email}</SelectItem>}
              </Select>
            )}
          />
          <Controller
            name={"taskSubject"}
            control={control}
            render={({ field }) => <Input label={"Hubspot Task Name"} className={"my-2"} {...field} />}
          />
          <Controller
            name={"taskPriority"}
            control={control}
            render={({ field }) => (
              <Select
                items={priorities}
                label="Task Priority"
                placeholder="Select a priority"
                className="max-w-s my-2"
                selectedKeys={[field.value]}
                {...field}
              >
                {(priority) => <SelectItem value={priority.value}>{priority.label}</SelectItem>}
              </Select>
            )}
          />
          <Controller
            name={"taskType"}
            control={control}
            render={({ field }) => (
              <Select
                items={types}
                label="Task Type"
                placeholder="Select a type"
                className="max-w-s my-2"
                selectedKeys={[field.value]}
                {...field}
              >
                {(priority) => <SelectItem value={priority.value}>{priority.label}</SelectItem>}
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
