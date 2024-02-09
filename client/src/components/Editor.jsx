import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PropTypes from "prop-types";

const modules = {
	toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image"], ["clean"]],
};

const Editor = ({ value, onChange }) => {
	return (
		<ReactQuill
			value={value}
			theme={"snow"}
			onChange={onChange}
			modules={modules}
		/>
	);
};

Editor.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default Editor;
