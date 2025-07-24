import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
// Configura Amplify
Amplify.configure(outputs);
// Crea cliente Amplify Data
const amplifyClient = generateClient({
    authMode: "userPool",
});
function App() {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(event.currentTarget);
            const ingredients = formData.get("ingredients")?.toString() || "";
            const { data, errors } = await amplifyClient.queries.askBedrock({
                ingredients: [ingredients],
            });
            if (!errors) {
                setResult(data?.body || "No data returned");
            }
            else {
                console.error(errors);
                setResult("An error occurred while fetching the recipe.");
            }
        }
        catch (e) {
            console.error(e);
            alert(`An error occurred: ${e}`);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "app-container", children: [_jsxs("div", { className: "header-container", children: [_jsxs("h1", { className: "main-header", children: ["Meet Your Personal", _jsx("br", {}), _jsx("span", { className: "highlight", children: "Recipe AI" })] }), _jsx("p", { className: "description", children: "Simply type a few ingredients using the format ingredient1, ingredient2, etc., and Recipe AI will generate an all-new recipe on demand..." })] }), _jsx("form", { onSubmit: onSubmit, className: "form-container", children: _jsxs("div", { className: "search-container", children: [_jsx("input", { type: "text", className: "wide-input", id: "ingredients", name: "ingredients", placeholder: "Ingredient1, Ingredient2, Ingredient3,...etc" }), _jsx("button", { type: "submit", className: "search-button", children: "Generate" })] }) }), _jsx("div", { className: "result-container", children: loading ? (_jsxs("div", { className: "loader-container", children: [_jsx("p", { children: "Loading..." }), _jsx(Loader, { size: "large" }), _jsx(Placeholder, { size: "large" }), _jsx(Placeholder, { size: "large" }), _jsx(Placeholder, { size: "large" })] })) : (result && _jsx("p", { className: "result", children: result })) })] }));
}
export default App;
