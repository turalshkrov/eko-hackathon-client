import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMapEvents,
	useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import { Button, Col, FloatButton, Form, Image, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import { SiCodemagic } from "react-icons/si";
import { useAppDispatch } from "../../hooks/hooks";
import { setIsOpen } from "../../store/ModalSlice/modalSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { iPark } from "../../types";
import Modals from "../../components/Modals";
import { FlagOutlined, SearchOutlined } from "@ant-design/icons";
import { ParkCard } from "../../components/ParkCard";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

const customIcon = new L.Icon({
	iconUrl: markerIcon,
	iconRetinaUrl: markerIcon2x,
	iconSize: [25, 41],
});

const { Title, Text } = Typography;
function Home() {
	const [form] = Form.useForm();
	const { getFieldValue } = form;
	const [parks, setParks] = useState<iPark[]>([]);
	const dispatch = useAppDispatch();
	const getParks = async () => {
		const name = getFieldValue("name");
		const response = await axios.get(
			`https://azercosmos-hackaton.vercel.app/parks/all?name=${name || ""}`
		);
		setParks(response.data.data);
	};
	useEffect(() => {
		getParks();
	}, []);

	const [position, setPosition] = useState<[number, number]>([40.37, 47.86]);

	const handleMarkerClick = (position: [number, number]) => {
		setPosition(position);
	};

	function ChangeView({ center }: { center: [number, number] }) {
		const map = useMap();
		map.invalidateSize();
		map.setView(center);
		return null;
	}

	const MapEvents = () => {
		useMapEvents({
			click(e) {
				console.log(e.latlng.lat);
				console.log(e.latlng.lng);
			},
		});
		return false;
	};

	const handleOpenSearchModal = () => {
		dispatch(setIsOpen({ id: "search", isOpen: true }));
	};

	const handleOpenReportModal = () => {
		dispatch(setIsOpen({ id: "report", isOpen: true }));
	};
	return (
		<>
			<Header />
			<FloatButton.Group
				trigger="click"
				shape="circle"
				style={{ right: 30, bottom: 30, width: 50, height: 50 }}
				icon={<SiCodemagic />}
			>
				<FloatButton
					onClick={handleOpenReportModal}
					icon={<FlagOutlined />}
					tooltip="Report"
				/>
				<FloatButton
					onClick={handleOpenSearchModal}
					icon={<SearchOutlined />}
					tooltip="Search"
				/>
			</FloatButton.Group>

			<Row className="p-4 md:p-8 banner" justify="start">
				<Title
					level={1}
					className="!font-bold !text-5xl mt-20 md:ml-16 !text-white"
				>
					Welcome to EcoFinder
				</Title>
				<Title level={3} className="!text-white md:ml-16 ">
					Discover Local Parks, Plants, and Report Environmental Issues.
				</Title>
			</Row>

			<Row className="px-8 mt-4">
				<Title level={3}>Explore the Parks</Title>
			</Row>

			<Row className="p-4">
				{parks
					.filter((_, index) => index < 4)
					.map((park) => (
						<Col span={24} md={6} className="px-4 py-2">
							<Link to={`/parks/${park.id}`}>
								<ParkCard data={park} />
							</Link>
						</Col>
					))}
			</Row>

			<Row className="px-8 mb-8">
				<Link to="/parks">
					<Button>Explore more</Button>
				</Link>
			</Row>

			<Row className="px-8">
				<Title level={3}>Find nearby parks</Title>
			</Row>

			<Row className="p-8" justify="center">
				<MapContainer
					center={position}
					zoom={7}
					style={{ height: "60vh", width: "100%" }}
				>
					<ChangeView center={position} />
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					/>
					{parks &&
						parks.map((park) => (
							<Marker
								key={park.id}
								position={[park.latitude, park.longitude]}
								icon={customIcon}
								eventHandlers={{
									click: () =>
										handleMarkerClick([park.latitude, park.longitude]),
								}}
							>
								<Popup className="!max-w-min">
									<Link to={`/parks/${park.id}`}>
										<Title level={5} className="!m-0">
											{park.name}
										</Title>
									</Link>
									<Text type="secondary" ellipsis>
										{park.description}
									</Text>
									<br />
									<Image
										src={park.image_url}
										preview={false}
										width={300}
										height={200}
										className="mt-2"
									/>
								</Popup>
							</Marker>
						))}

					<MapEvents />
				</MapContainer>
			</Row>

			<Footer />
			<Modals />
		</>
	);
}

export default Home;
