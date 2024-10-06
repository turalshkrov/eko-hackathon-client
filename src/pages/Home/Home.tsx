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
import {
	Col,
	FloatButton,
	Form,
	Image,
	Input,
	Popover,
	Row,
	Typography,
} from "antd";
import { Link } from "react-router-dom";
import { SiCodemagic } from "react-icons/si";
import { useAppDispatch } from "../../hooks/hooks";
import { setIsOpen } from "../../store/ModalSlice/modalSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { iPark } from "../../types";
import Modals from "../../components/Modals";

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
	return (
		<>
			<Row className="top-0 p-4 z-50 items-center">
				<Col span={0} md={6} className="text-center">
					<Title level={4} className="!m-0">
						EcoFinder
					</Title>
				</Col>
				<Col span={24} md={12} style={{ height: "32px" }}>
					<Form form={form}>
						<Form.Item name="name">
							<Input.Search className="w-full" onChange={getParks} />
						</Form.Item>
					</Form>
				</Col>
			</Row>
			<MapContainer
				center={position}
				zoom={8}
				style={{ height: "calc(100vh - 64px)", width: "100%" }}
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
								click: () => handleMarkerClick([park.latitude, park.longitude]),
							}}
						>
							<Popup className="!max-w-min">
								<Link to={`/parks/${park.id}`}>
									<Title level={5} className="!m-0">
										{park.name}
									</Title>
								</Link>
								<Text type="secondary">{park.description}</Text>
								<br />
								<Image
									src={park.image_url}
									preview={false}
									width={200}
									className="mt-2"
								/>
							</Popup>
						</Marker>
					))}

				<MapEvents />
			</MapContainer>
			<Popover content={"Find plants or animals"} placement="topRight">
				<FloatButton
					shape="circle"
					style={{ right: 30, bottom: 30, width: 50, height: 50 }}
					icon={<SiCodemagic />}
					onClick={handleOpenSearchModal}
				/>
			</Popover>
			<Modals />
		</>
	);
}

export default Home;
