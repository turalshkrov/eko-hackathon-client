import axios from "axios";
import Logo from "../assets/Logo.png";
import { Col, Form, Row, Typography, Image, AutoComplete } from "antd";
import { useState } from "react";
import { iPark } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
const { Title } = Typography;

export const Header = () => {
	const [form] = Form.useForm();
	const [parks, setParks] = useState<iPark[]>([]);

	const navigate = useNavigate();

	const handleSearch = async (value: string) => {
		const response = await axios.get(
			`https://azercosmos-hackaton.vercel.app/parks/all?name=${value || ""}`
		);
		setParks(response.data.data);
	};
	return (
		<Row
			className="top-0 p-4 z-50 items-center w-full bg-white"
			gutter={[0, 16]}
		>
			<Col span={24} md={6} className="!m-0 flex items-center justify-center">
				<Image src={Logo} alt="logo" preview={false} width={40} />
				<Link to="/">
					<Title level={4} className="!m-0 !ml-4">
						EcoFinder
					</Title>
				</Link>
			</Col>
			<Col span={24} md={4} style={{ height: "32px" }} className="mb-2">
				<Form form={form}>
					<Form.Item name="name">
						<AutoComplete
							options={parks.map((plant) => ({
								key: plant.id,
								label: plant.name,
								value: plant.name,
							}))}
							onSearch={handleSearch}
							onSelect={(_, record) => navigate(`/parks/${record.key}`)}
							className="w-full"
							size="large"
							suffixIcon={<SearchOutlined />}
						/>
					</Form.Item>
				</Form>
			</Col>

			<Col span={24} md={14} className="flex items-center justify-center">
				<Link to="/" className="ml-4">
					<Title level={5} className="!m-0 !ml-4">
						Home
					</Title>
				</Link>

				<Link to="/parks" className="ml-4">
					<Title level={5} className="!m-0 !ml-4">
						Parks
					</Title>
				</Link>

				<Link to="/browse" className="ml-4">
					<Title level={5} className="!m-0 !ml-4">
						Browse
					</Title>
				</Link>

				<Link to="/about" className="ml-4">
					<Title level={5} className="!m-0 !ml-4">
						About
					</Title>
				</Link>
			</Col>
		</Row>
	);
};
