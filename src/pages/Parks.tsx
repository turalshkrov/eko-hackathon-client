import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ParkCard } from "../components/ParkCard";
import { iPark } from "@/types";
import { Col, Row, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const { Title } = Typography;

export const Parks = () => {
	const [parks, setParks] = useState<iPark[]>([]);
	const getParks = async () => {
		const response = await axios.get(
			`https://azercosmos-hackaton.vercel.app/parks/all`
		);
		setParks(response.data.data);
	};
	useEffect(() => {
		getParks();
	}, []);

	return (
		<>
			<Header />
			<Row className="p-4 md:p-8">
				<Col span={24} className="px-8 mb-4">
					<Title level={2}>Parks</Title>
					<Title level={4} type="secondary">
						This is where your mind will wander, where your soul will flourish &
						where your senses come alive. Share your experience.
					</Title>
				</Col>
				{parks.map((park) => (
					<Col className="p-4" span={24} key={park.id} md={6}>
						<Link to={`/parks/${park.id}`}>
							<ParkCard data={park} />
						</Link>
					</Col>
				))}
			</Row>
			<Footer />
		</>
	);
};
