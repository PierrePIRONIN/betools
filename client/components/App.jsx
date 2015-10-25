const {AppBar, Tabs, Tab} = mui;

App = React.createClass({
    render() {
        return (
            <div>
                <div className="row">
                    <AppBar title="BeTools"/>
                </div>

                <div className="row">
                    <DjuComputation/>
                    <DjuImport/>
                </div>
            </div>
        );
    }
});