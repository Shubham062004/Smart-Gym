import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { aiService } from '../../src/services/aiService';
import { useAuthStore } from '../../src/store/authStore';
import { useHeaderHeight } from '@react-navigation/elements';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string | any;
    isStructured?: boolean;
}

export default function AIChatbotScreen() {
    const { user } = useAuthStore();
    const headerHeight = useHeaderHeight();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', content: "Hello! I'm your OnlyFitness AI Coach. How can I help you reach your goals today?" }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMsg = inputText.trim();
        const newMessage: Message = { id: Date.now().toString(), role: 'user', content: userMsg };
        
        setInputText('');
        setMessages(prev => [...prev, newMessage]);
        setIsLoading(true);

        try {
            const data = await aiService.chat(userMsg);
            
            // Handle new combined response format
            const aiMessage: Message = { 
                id: (Date.now() + 1).toString(),
                role: 'ai', 
                content: data.message,
                isStructured: data.workoutPlan?.length > 0 || data.dietPlan?.length > 0
            };

            setMessages(prev => [...prev, aiMessage]);

            if (data.workoutPlan?.length > 0) {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 2).toString(),
                    role: 'ai',
                    content: { type: 'workout_plan', plan: data.workoutPlan },
                    isStructured: true
                }]);
            }
            
            if (data.dietPlan?.length > 0) {
                 setMessages(prev => [...prev, {
                    id: (Date.now() + 3).toString(),
                    role: 'ai',
                    content: { type: 'diet_plan', plan: data.dietPlan },
                    isStructured: true
                }]);
            }

        } catch (error) {
            setMessages(prev => [...prev, { id: 'err', role: 'ai', content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
        }
    }, [messages, isLoading]);

    const renderMessage = ({ item }: { item: Message }) => (
        <View className={`flex-row mb-6 ${item.role === 'user' ? 'justify-end' : 'items-start'}`}>
            {item.role === 'ai' && (
                <View className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2 mt-1">
                    <MaterialIcons name="smart-toy" size={16} color="black" />
                </View>
            )}
            <View className={`px-4 py-3 rounded-2xl max-w-[85%] ${
                item.role === 'user' 
                ? 'bg-blue-600 rounded-br-none' 
                : 'bg-slate-800 rounded-tl-none border border-white/5'
            }`}>
                {typeof item.content === 'string' ? (
                    <Text className="text-sm text-white leading-relaxed">{item.content}</Text>
                ) : (
                    item.isStructured && item.content.type === 'workout_plan' ? (
                        renderWorkoutPlan(item.content.plan)
                    ) : (
                        <Text className="text-sm text-white">{JSON.stringify(item.content)}</Text>
                    )
                )}
            </View>
        </View>
    );

    const renderWorkoutPlan = (plan: any) => (
        <View className="w-full bg-black/40 rounded-xl overflow-hidden mt-2 border border-white/10">
            <View className="bg-white/5 p-3 border-b border-white/5">
                <Text className="font-bold text-xs text-primary uppercase tracking-widest">Recommended Workout</Text>
            </View>
            <View className="p-3">
                {plan.map((item: any, i: number) => (
                    <View key={i} className="flex-row justify-between items-center mb-2">
                        <Text className="text-xs text-white/70">{item.exercise}</Text>
                        <Text className="text-xs font-bold text-primary">{item.sets} x {item.reps || item.duration}</Text>
                    </View>
                ))}
                <TouchableOpacity className="w-full py-2 bg-primary rounded-lg items-center mt-3 shadow-lg shadow-primary/20">
                    <Text className="text-xs font-bold text-black uppercase">START WORKOUT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-black">
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                className="flex-1"
                keyboardVerticalOffset={headerHeight + (Platform.OS === 'ios' ? 0 : 20)}
            >
                <View className="flex-row items-center px-6 py-4 bg-black border-b border-white/5">
                    <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center border border-primary/30">
                        <MaterialIcons name="smart-toy" size={20} color="#0df20d" />
                    </View>
                    <View className="ml-3">
                        <Text className="text-base font-bold text-white tracking-tight">AI Coach</Text>
                        <View className="flex-row items-center">
                            <View className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5" />
                            <Text className="text-[10px] text-primary font-bold uppercase tracking-widest">Ready to assist</Text>
                        </View>
                    </View>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    className="flex-1 px-4 pt-4"
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListFooterComponent={isLoading ? (
                        <View className="flex-row items-center mb-6 pl-10">
                            <ActivityIndicator size="small" color="#0df20d" />
                            <Text className="ml-3 text-white/30 text-xs font-medium">AI Coach is typing...</Text>
                        </View>
                    ) : null}
                />

                <View className="p-4 bg-black border-t border-white/5">
                    <View className="flex-row items-center bg-slate-900 rounded-2xl px-4 py-2 border border-white/5">
                        <TextInput 
                            className="flex-1 text-white text-sm h-10"
                            placeholder="Type a message..."
                            placeholderTextColor="#64748b"
                            value={inputText}
                            onChangeText={setInputText}
                            onSubmitEditing={handleSend}
                            multiline={false}
                        />
                        <TouchableOpacity 
                            onPress={handleSend}
                            className={`w-10 h-10 rounded-xl items-center justify-center ${inputText.trim() ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-800'}`}
                            disabled={!inputText.trim() || isLoading}
                        >
                            <MaterialIcons name="send" size={18} color={inputText.trim() ? "black" : "#475569"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
