import { iPark } from "@/types";
import { Card, Typography } from "antd";

const { Paragraph } = Typography;
export const ParkCard = ({ data }: { data: iPark }) => {
	return (
		<Card
			title={data.name}
			cover={
				<img
					alt="example"
					src={data.image_url}
					className="w-full h-40 !rounded-none card-cover"
				/>
			}
			hoverable
		>
			<Paragraph ellipsis={{ rows: 2 }}>{data.description}</Paragraph>
		</Card>
	);
};
