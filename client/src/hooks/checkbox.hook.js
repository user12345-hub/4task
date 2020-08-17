export const useAuth = () =>
    function Checkbox() {
    const [checked, setChecked] = React.useState(true)

    return (
        <label>
            <input type="checkbox"
                   checked={checked}
                   onChange={() => setChecked(!checked)}
            />
            Check Me!
        </label>
    );
}

ReactDOM.render(
    <Checkbox />,
    document.getElementById('checkbox'),
);