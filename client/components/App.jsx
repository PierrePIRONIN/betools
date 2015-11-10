const {
    Styles
    } = MUI;

const { ThemeManager, LightRawTheme } = Styles;

App = React.createClass({
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext() {
        return {
            muiTheme: ThemeManager.getMuiTheme(LightRawTheme)
        };
    },

    render() {
        return (
            <div>
                <div className="row">
                    <NavBar/>
                </div>
            </div>
        );
    }
});