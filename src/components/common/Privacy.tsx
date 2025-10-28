interface PrivacyProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Privacy = ({ isOpen, onClose }: PrivacyProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Privacy Policy</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">1. Introduction</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Virtual Science Lab is committed to protecting your privacy. This Privacy Policy explains how we collect, use,
                            and safeguard your personal information when you use our educational platform.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">2. Information We Collect</h3>
                        <div className="space-y-3">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">Personal Information:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                                <li>Name and email address for account creation</li>
                                <li>User preferences and settings</li>
                                <li>Chat history and AI interactions (for improving the service)</li>
                                <li>Experiment history and saved work</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">3. How We Use Your Information</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We use the collected information to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mt-3">
                            <li>Provide and personalize our educational services</li>
                            <li>Process your account registration and authentication</li>
                            <li>Improve our platform and develop new features</li>
                            <li>Communicate with you about updates and important information</li>
                            <li>Analyze usage patterns to enhance user experience</li>
                            <li>Provide AI-powered educational assistance</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">4. Data Storage and Security</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Your data is stored securely using modern cloud infrastructure (Appwrite). We implement industry-standard security
                            measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">5. Third-Party Services</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We use the following third-party services that may process your information:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mt-3">
                            <li><strong>Appwrite:</strong> For authentication and data storage</li>
                            <li><strong>Google Generative AI:</strong> For AI-powered educational assistance (chat interactions are sent to Google's API)</li>
                            <li><strong>Google Analytics:</strong> For understanding platform usage (if enabled)</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                            These services have their own privacy policies that govern their use of your information.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">6. AI Service Data</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            When you interact with our AI assistant, your messages and conversation context are sent to Google's Generative AI
                            service to provide educational responses. This data is used solely for the purpose of generating AI responses and
                            may be subject to Google's privacy policy.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">7. Your Rights</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mt-3">
                            <li>Access your personal data</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your account and associated data</li>
                            <li>Opt-out of certain data collection features in settings</li>
                            <li>Export your data (experiment history, settings, etc.)</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">8. Cookies and Tracking</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We may use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences
                            through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">9. Children's Privacy</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Our platform is designed for educational use. While we do not knowingly collect personal information from children
                            under 13, we recommend that minors use this platform under adult supervision.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">10. Changes to Privacy Policy</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We reserve the right to update this Privacy Policy at any time. We will notify users of significant changes by
                            posting a notice on the platform or sending an email notification.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">11. Contact Us</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            If you have any questions or concerns about this Privacy Policy or your data, please contact us through the
                            settings page or via the support channels.
                        </p>
                    </section>

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

