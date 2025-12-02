import React from 'react';
import { Camera, Move, ChevronDown, ChevronUp, Focus, Circle, Square, Eye } from 'lucide-react';
import { useConfig } from '../hooks/useConfig';

function ShoeCameraAngleSelection({ selectedAngle, onAngleSelect }) {
    const { config, loading, error } = useConfig();

    if (loading) {
        return (
            <div className="text-center py-8 text-slate-400">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                <p className="mt-2">Loading camera angles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                Error loading camera angles: {error}
            </div>
        );
    }

    const cameraAngles = config?.shoeCameraAngles || [];

    // Visual icon representations for each angle
    const getVisualIcon = (angleKey) => {
        const visualMap = {
            'side_profile': (
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-14 border-4 border-current rounded-lg transform -rotate-12"></div>
                    </div>
                    <Camera className="absolute top-1 right-1 w-4 h-4 opacity-60" />
                </div>
            ),
            'three_quarter': (
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-14 border-4 border-current rounded-lg transform -rotate-6"></div>
                    </div>
                    <Camera className="absolute top-1 right-2 w-4 h-4 opacity-60" />
                </div>
            ),
            'front_view': (
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-14 border-4 border-current rounded-lg"></div>
                    </div>
                    <Camera className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-4 opacity-60" />
                </div>
            ),
            'top_down': (
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-6 border-4 border-current rounded-full"></div>
                    </div>
                    <ChevronDown className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 opacity-60" />
                </div>
            ),
            'low_angle': (
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-16 border-4 border-current rounded-lg transform perspective-1000"></div>
                    </div>
                    <ChevronUp className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-5 opacity-60" />
                </div>
            ),
            'detail_closeup': (
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Circle className="w-14 h-14 opacity-40" />
                        <div className="absolute w-6 h-8 border-4 border-current rounded"></div>
                    </div>
                    <Focus className="absolute bottom-1 right-1 w-5 h-5 opacity-60" />
                </div>
            )
        };
        return visualMap[angleKey] || <Camera className="w-12 h-12" />;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-semibold text-slate-900">Camera Angle</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {cameraAngles.map((angle) => {
                    const isSelected = selectedAngle?.id === angle.id;

                    return (
                        <button
                            key={angle.id}
                            onClick={() => onAngleSelect(angle)}
                            className={`
                                relative p-6 rounded-2xl border-2 transition-all group
                                ${isSelected
                                    ? 'border-slate-900 bg-slate-900 text-white shadow-xl scale-105'
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:shadow-lg hover:scale-102'
                                }
                            `}
                        >
                            {isSelected && (
                                <div className="absolute top-2 right-2 bg-white text-slate-900 rounded-full p-1">
                                    <Circle className="w-3 h-3 fill-current" />
                                </div>
                            )}
                            <div className="flex flex-col items-center gap-3">
                                <div className={`transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
                                    {getVisualIcon(angle.id)}
                                </div>
                                <p className={`font-semibold text-sm text-center ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                    {angle.name.en}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default ShoeCameraAngleSelection;
