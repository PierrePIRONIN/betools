const {Card, CardTitle, CardText, TextField} = mui;

DjuComputation = React.createClass({
    render() {
        return (
            <Card className="col-xs-12 col-sm-6">
                <CardTitle title="Calcul de DJU"/>
                <CardText>
                    <form>
                        <TextField floatingLabelText="Chauffe (°C)" hintText="ex: 20.5"/>
                    </form>
                </CardText>
            </Card>
        );
    }
});