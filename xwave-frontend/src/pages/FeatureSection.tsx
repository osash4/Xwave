import React from 'react';

interface FeatureSectionProps {
    title: string;
    description: string;
    iconSrc: string;
    buttonText: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ title, description, iconSrc, buttonText }) => {
    return (
        <div className="feature-section">
            <img src={iconSrc} alt={title} className="feature-icon" />
            <h2>{title}</h2>
            <p>{description}</p>
            <button className="feature-btn">{buttonText}</button>
        </div>
    );
};

export default FeatureSection;
