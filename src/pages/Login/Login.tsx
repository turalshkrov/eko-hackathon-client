import { Button, Col, Input, Row, Typography, Form } from "antd";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const { Title } = Typography;

function Login() {
	const [form] = useForm();
	const { getFieldsValue } = form;

	const handleSubmit = async () => {
		toast.promise(
			axios.get(
				"https://azercosmos-hackaton.vercel.app/auth/login",
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
				<Title className="text-center">Login</Title>
				<Form form={form} className="mt-20">
					<FormItem name="email">
						<Input inputMode="email" size="large" placeholder="Email" />
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
							Don't have an account?
							<Link to="/signup">
								<Button type="link" className="p-0 font-bold ml-2">
									Sign up
								</Button>
							</Link>
						</Typography.Text>
					</Col>
				</Form>
			</Col>
		</Row>
	);
}

export default Login;
