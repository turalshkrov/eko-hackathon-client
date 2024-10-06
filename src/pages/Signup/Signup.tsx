import { Button, Col, Input, Row, Typography, Form } from "antd";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const { Title } = Typography;

function Signup() {
	const [form] = useForm();
	const { getFieldsValue } = form;

	const handleSubmit = () => {
		toast.promise(
			axios.post(
				"https://azercosmos-hackaton.vercel.app/auth/register",
				getFieldsValue()
			),
			{
				loading: "Loading...",
				success: "Success",
				error: "Error",
			}
		);
	};
	return (
		<Row justify="center" className="p-4 items-center h-screen">
			<Col span={24} md={12} lg={9} xl={7} xxl={5} className="mb-20">
				<Title className="text-center">Signup</Title>
				<Form form={form} className="mt-20">
					<FormItem name="country">
						<Input size="large" placeholder="Country" />
					</FormItem>
					<FormItem name="nickname">
						<Input size="large" placeholder="Nickname" />
					</FormItem>
					<FormItem name="email">
						<Input size="large" placeholder="Email" />
					</FormItem>
					<FormItem name="password">
						<Input.Password size="large" placeholder="Password" />
					</FormItem>

					<Button
						htmlType="submit"
						className="w-full"
						onClick={handleSubmit}
						type="primary"
						size="large"
					>
						Log in
					</Button>
					<Col className="text-center mt-4">
						<Typography.Text className="text-base">
							Have an account?
							<Link to="/login">
								<Button type="link" className="p-0 font-bold ml-2">
									Login
								</Button>
							</Link>
						</Typography.Text>
					</Col>
				</Form>
			</Col>
		</Row>
	);
}

export default Signup;
