import {
	Button,
	Col,
	FloatButton,
	Form,
	Image,
	Input,
	Popover,
	Row,
	Typography,
} from "antd";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import { useParams } from "react-router-dom";
import { iGallery, iPark } from "@/types";
import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { SiCodemagic } from "react-icons/si";
import { useAppDispatch } from "../../hooks/hooks";
import { setIsOpen } from "../../store/ModalSlice/modalSlice";
import Modals from "../../components/Modals";
import "./Gallery.css";

const customIcon = new L.Icon({
	iconUrl: markerIcon,
	iconRetinaUrl: markerIcon2x,
	iconSize: [25, 41],
});

const { Title, Text } = Typography;

function Park() {
	const dispatch = useAppDispatch();
	const { id } = useParams();
	const [parkData, setParkData] = useState<iPark>();
	const [gallery, setGallery] = useState<iGallery[]>([]);
	const [mapStyle, setMapStyle] = useState<any>();
	useEffect(() => {
		axios
			.get(`https://azercosmos-hackaton.vercel.app/parks/${id}`)
			.then((response) => {
				setParkData(response.data.data);
			});

		axios
			.get(`https://azercosmos-hackaton.vercel.app/gallery/${id}`)
			.then((response) => {
				setGallery(response.data.data);
			});

		setMapStyle({ height: "100vh", position: "sticky", top: 0 });
	}, [id]);

	const [form] = Form.useForm();
	const { getFieldsValue } = form;
	const handleSubmit = () => {
		emailjs.send(
			"service_c0t8iga",
			"template_0czdwwq",
			getFieldsValue(),
			"3AzAwP5ty9bDdIdJU"
		);
		getFieldsValue();
	};
	const handleOpenSearchModal = () => {
		dispatch(setIsOpen({ id: "search", isOpen: true }));
	};
	return (
		<>
			<Row>
				{parkData && (
					<>
						<Col span={24} md={12}>
							<MapContainer
								center={[parkData?.latitude, parkData?.longitude]}
								zoom={12}
								className="!h-96 md:!h-screen"
								style={mapStyle}
							>
								<TileLayer
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								/>

								<Marker
									key={parkData.id}
									position={[parkData.latitude, parkData.longitude]}
									icon={customIcon}
								>
									<Popup>
										<Title level={5}>{parkData.name}</Title>
									</Popup>
								</Marker>
							</MapContainer>
						</Col>
						<Col span={24} md={12} className="p-6 z-10">
							<Title level={2} className="!font-bold">
								{parkData?.name}
							</Title>

							<Text type="secondary" className="!text-base">
								{parkData?.description}
							</Text>
							<Col span={24} className="grid-gallery mt-4">
								{gallery.map((item) => (
									<Image
										key={item.id}
										src={item.image_url}
										className="w-full !h-full p-3 "
										preview={false}
									/>
								))}
							</Col>
							<Form className="mt-8" form={form}>
								<Title level={4}>Report a problem</Title>
								<Form.Item name="name">
									<Input placeholder="Enter your name" />
								</Form.Item>
								<Form.Item name="message">
									<Input.TextArea placeholder="Write problem details" />
								</Form.Item>
								<Button type="primary" size="large" onClick={handleSubmit}>
									Report
								</Button>
							</Form>
						</Col>
					</>
				)}
				<Popover content={"Find plants or animals"} placement="topRight">
					<FloatButton
						shape="circle"
						style={{ right: 30, bottom: 30, width: 50, height: 50 }}
						icon={<SiCodemagic />}
						onClick={handleOpenSearchModal}
					/>
				</Popover>
				<Modals />
			</Row>
		</>
	);
}

export default Park;
