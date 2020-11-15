import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Alert,
  Typography,
  InputNumber,
  Space,
  message,
} from "antd";
import Head from "../../Head/head.component";
import { useHistory } from "react-router-dom";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { addNewCoach } from "../../../services/api";

function AddNewCoach() {
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const handleSubmit = async (payload: any) => {
    try {
      setIsLoading(true);
      if (payload.composition === undefined) {
        throw Error("Atleast one seat is required in the new coach");
      }
      let res = await addNewCoach(payload);
      if (res.data.error === true) {
        throw Error(res.data.message);
      }

      message.success(`Successfully added coach ${res.data.coach.name} with coach id ${res.data.coach.coach_id}`, 4);
      setTimeout(() => {
        history.push("/");
      }, 2500);
    } catch (err) {
      setErrors(err.message);
    }
    setIsLoading(false);
  };

  const [form] = Form.useForm();
  return (
    <div>
      <Head />
      <div className="form-wrapper">
        <Typography.Title style={{ textAlign: "center" }}>
          Add New Coach
        </Typography.Title>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          onFinish={handleSubmit}
        >
          {errors ? (
            <Form.Item>
              <Alert message={errors} type="error" />
            </Form.Item>
          ) : null}

          <Form.Item
            name="name"
            label="Coach Name"
            rules={[{ required: true, message: "Enter a valid Coach Name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Coach Description"
            rules={[
              { required: true, message: "Enter a valid Coach Description" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.List name="composition">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => {
                  return (
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.area !== curValues.area ||
                          prevValues.sights !== curValues.sights
                        }
                      >
                        {() => (
                          <Form.Item
                            {...field}
                            label="Seat Number"
                            name={[field.name, "berth_number"]}
                            fieldKey={[field.fieldKey, "berth_number"]}
                            rules={[
                              { required: true, message: "Add a valid number" },
                            ]}
                          >
                            <InputNumber />
                          </Form.Item>
                        )}
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Seat Type"
                        name={[field.name, "berth_type"]}
                        fieldKey={[field.fieldKey, "berth_type"]}
                        rules={[
                          {
                            required: true,
                            message: "Add a valid seat type like LB, UB etc",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  );
                })}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add a seat
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Add Coach
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default AddNewCoach;
