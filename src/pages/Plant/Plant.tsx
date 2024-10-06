import { iPark, iPlant } from "../../types";
import { Col, Row, Typography, Image, List, Flex, Divider } from "antd";
import axios from "axios";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Link, useParams } from "react-router-dom";
import { FaTree } from "react-icons/fa";

const customIcon = new L.Icon({
	iconUrl: markerIcon,
	iconRetinaUrl: markerIcon2x,
	iconSize: [25, 41],
});

const { Title, Text } = Typography;

export const Plant = () => {
	const parkRef = useRef(null);
	const [position, setPosition] = useState<[number, number]>([40.37, 47.86]);
	function ChangeView({ center }: { center: [number, number] }) {
		const map = useMap();
		map.setView(center);
		return null;
	}
	const { id } = useParams();

	const [plantData, setPlantData] = useState<iPlant>();
	const [mapStyle, setMapStyle] = useState<any>();

	useEffect(() => {
		axios
			.get(`https://azercosmos-hackaton.vercel.app/plants/${id}`)
			.then((response) => {
				setPlantData(response.data.data);
			});
		setMapStyle({ height: "100vh", position: "sticky", top: 0 });
	}, [id]);

	const handleParkClick = (park: iPark) => {
		setPosition([park.latitude, park.longitude]);
	};

	return (
		<>
			<Row>
				{plantData && (
					<>
						<Col span={24} md={12}>
							<MapContainer
								center={[40.37, 47.86]}
								zoom={8}
								className="!h-96 md:!h-screen"
								style={mapStyle}
							>
								<TileLayer
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								/>
								{plantData.parks.map((park) => (
									<Marker
										ref={parkRef}
										key={park.id}
										position={[park.latitude, park.longitude]}
										icon={customIcon}
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

								<ChangeView center={position} />
							</MapContainer>
						</Col>
						<Col span={24} md={12} className="p-6 z-10">
							<Title level={2} className="!font-bold">
								{plantData?.name}
							</Title>
							<Text type="secondary" className="!text-base">
								{plantData?.description}
							</Text>
							<Divider className="my-4" />
							<Image
								src={plantData.image_url}
								className="w-full rounded-lg"
								width="100%"
							/>
							<Title level={3} className="!font-bold mt-4">
								Parks
							</Title>
							<List
								className="mt-4"
								dataSource={plantData.parks}
								renderItem={(item) => (
									<List.Item
										className="cursor-pointer"
										onClick={() => handleParkClick(item)}
									>
										<Flex align="center">
											<FaTree className="mr-3" size={16} color="#555" />
											{item.name}
										</Flex>
									</List.Item>
								)}
							/>
						</Col>
					</>
				)}
			</Row>
		</>
	);
};
