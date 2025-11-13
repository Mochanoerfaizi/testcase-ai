import {Image} from "@chakra-ui/react";
import {LogoMain} from "../../assets/images/index.jsx";

export default function ApplicationLogo(props) {
    return (
        <Image
            src={LogoMain ?? props.src}
            alt="Logo"
            {...props}
        />
    )
}
