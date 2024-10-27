import { useForm } from "antd/es/form/Form";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { setIsOpen } from "../../store/ModalSlice/modalSlice";
import { modalIsOpenSelector } from "../../store/selectors";
import { Modal, Upload, Form, Button, Input, Typography, Select } from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import axios from "axios";
import { ReportTypesConstants } from "../../config/constants";

const { Title } = Typography;

// import * as tf from "@tensorflow/tfjs";

// async function loadModel() {
// 	const model = await tf.loadGraphModel("./model.json");
// 	return model;
// }
export const ReportModal = () => {
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector((state) =>
		modalIsOpenSelector(state, "report")
	);

	const [image, setImage] = useState<string>();
	const [form] = useForm();
	const { setFieldValue, getFieldValue, resetFields } = form;

	const handleCloseModal = () => {
		dispatch(setIsOpen({ id: "report", isOpen: false }));
	};

	const beforeUpload = (file: File) => {
		const isImage = file.type.startsWith("image/");
		if (!isImage) {
			return Upload.LIST_IGNORE; // Prevent upload
		}

		const reader = new FileReader();
		reader.onload = () => {
			const base64String = reader.result as string;
			setFieldValue("image", base64String);
			setImage(base64String.replace(/^data:image\/\w+;base64,/, ""));
		};

		reader.readAsDataURL(file);
		return false;
	};

	const getLocation = async () => {
		try {
			const position: GeolocationPosition = await new Promise(
				(resolve, reject) => {
					navigator.geolocation.getCurrentPosition(resolve, reject);
				}
			);
			return [position.coords.latitude, position.coords.longitude];
		} catch (error) {
			console.error(error);
		}
	};

	// async function predict(imageElement) {
	// 	const model = await loadModel();

	// 	let tensor = tf.browser
	// 		.fromPixels(imageElement)
	// 		.resizeNearestNeighbor([640, 640]) // resize to model's input size
	// 		.toFloat()
	// 		.div(tf.scalar(255.0)) // normalize to [0, 1]
	// 		.expandDims();

	// 	const predictions = await model.executeAsync(tensor);

	// 	tensor.dispose(); // Clean up tensors to free memory
	// 	return predictions;
	// }

	const handleSubmit = async () => {
		// predict(image)
		// 	.then((predictions) => {
		// 		console.log(predictions);
		// 	})
		// 	.catch((error) => {
		// 		console.error(error);
		// 	});

		const location = await getLocation();
		const description = getFieldValue("description");

		if (!description || !image) {
			toast.error("Please fill in all fields");
			return;
		}

		toast.promise(
			axios.post("https://azercosmos-hackaton.vercel.app/reports", {
				image: image,
				description: getFieldValue("description"),
				problem_type_id: getFieldValue("problem_type_id"),
				location,
			}),
			{
				loading: "Loading...",
				success: "Success",
				error: "Error",
			}
		);
		resetFields();
		dispatch(setIsOpen({ id: "report", isOpen: false }));
	};

	return (
		<Modal
			title="Report a problem"
			centered
			open={isOpen}
			onCancel={handleCloseModal}
			onOk={handleSubmit}
		>
			<Title level={5} type="secondary" className="mt-2">
				Upload an image of the problem
			</Title>

			<Form form={form}>
				<Form.Item name="image" rules={[{ required: true }]}>
					<Upload beforeUpload={beforeUpload} multiple={false}>
						<Button icon={<UploadOutlined />} className="mt-2">
							Click to Upload
						</Button>
					</Upload>
				</Form.Item>

				<Form.Item name="description" rules={[{ required: true }]}>
					<Input.TextArea placeholder="Description" autoSize maxLength={500} />
				</Form.Item>

				<Form.Item name="problem_type_id">
					<Select options={ReportTypesConstants} placeholder="Problem Type" />
				</Form.Item>
			</Form>
		</Modal>
	);
};
