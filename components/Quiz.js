import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Appbar, RadioButton, Button } from 'react-native-paper';

class Quiz extends Component {

    state = {
        questions: [],
        checked: '',
        index: 0,
        correct: 0,
        isResult:false
    }

    componentDidMount() {
        fetch("https://opentdb.com/api.php?amount=10")
            .then((response) => response.json())
            .then((res) => {
                let questions = res.results.map((item, index) => {
                    return (
                        <View key={index} >
                            <View>
                                <Text style={{ margin: 10 }} >{index + 1}) {item.question}</Text>
                            </View>
                            <View>
                                <RadioButton.Group
                                    onValueChange={checked => {
                                        console.log('checked ===>',checked)
                                        this.setState({ checked })
                                    }}
                                    value={this.state.checked}
                                >
                                    <View style={{ display: 'flex', flexDirection: 'row' }} >
                                        <RadioButton
                                            value={item.correct_answer}
                                        />
                                        <Text style={{ marginTop: 8 }} >{item.correct_answer}</Text>
                                    </View>
                                    {item.incorrect_answers.map((element, index1) => {
                                        return (
                                            <View style={{ display: 'flex', flexDirection: 'row' }} key={index1} >
                                                <RadioButton
                                                    value={element}
                                                />
                                                <Text style={{ marginTop: 8 }} >{element}</Text>
                                            </View>
                                        )
                                    })}
                                </RadioButton.Group>

                            </View>
                            <Button mode="contained"  onPress={() => this.nextQues(item.correct_answer)}>
                                Next
                            </Button>
                        </View>
                    )
                })
                this.setState({ questions })
            })

    }

    nextQues = (ans) => {
        const { questions ,index, checked, correct } = this.state
        console.log('ans ===>',ans)
        console.log('checked from func ===>',checked)
        console.log('index===>',index)
        if (ans === checked) {
            this.setState({ correct: correct + 1 })
        }
        if(index!==questions.length-1){
            
        this.setState({
            index: index + 1,
            checked: ''
        })
        }
        else{
            this.setState({
                index: index + 1,
                checked: '',
                isResult:true
            })
        }
    }

    render() {
        const { checked } = this.state;
        console.log('checked from render ==>',this.state.checked)
        return (
            <View>
                <Appbar.Header>
                    <Appbar.BackAction
                        onPress={() => console.log('peche agaye')}
                    />
                    <Appbar.Content
                        title="QUIZ APPICATION"
                    />
                </Appbar.Header>
                {this.state.isResult ? <View>
                    <View>
                        <Text style={{fontSize:20,fontWeight:'600',margin:10,textAlign:"center"}} >RESULT</Text>
                    </View>
                    <View>
                        <Text>Corret Answer: {this.state.correct}</Text>
                    </View>
                    <Button mode="contained" onPress={()=>this.setState({index:0,checked:'',isResult:false})} >
                        Play Again
                    </Button>
                </View>  : <View>
                    {
                        this.state.questions[this.state.index]
                    }   
                </View>}
            </View>
        );
    }
}

export default Quiz