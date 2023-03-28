import {
	Textarea,
	Button,
	Center,
	Container,
	Checkbox,
	Select,
} from "@mantine/core";
import { useEffect, useState } from "react";
import styles from "../../styles/PromptForm.module.css";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

const VERSION = process.env.NEXT_PUBLIC_VERSION;

export default function LoginForm(props) {
	const { unlock } = props;
	
	const [pass, setPass] = useState("");
	const [error, setError] = useState("");
	
	function checkPass() {
		if(pass === ""){
			setError("Please enter a password");
			
		}else{
			setError("");
			unlock(pass);
		}
	}
	
	return (
		<Container className={styles.form_section} shadows="md">
			<Container>
				<Textarea
					withAsterisk
					value={pass}
					onChange={(e) => setPass(e.target.value)}
					error={error}
				/>
				<Center>
					<Button
						radius="md"
						size="md"
						onClick={checkPass}
						className={styles.ask_button}
					>
						Login
					</Button>
				</Center>
			</Container>
		</Container>
	);
}
