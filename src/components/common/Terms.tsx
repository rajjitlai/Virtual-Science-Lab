interface TermsProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Terms = ({ isOpen, onClose }: TermsProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Terms and Conditions</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">1. Acceptance of Terms</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            By accessing and using the Virtual Science Lab platform, you accept and agree to be bound by these Terms and Conditions.
                            If you do not agree with any part of these terms, you must not use this service.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">2. Description of Service</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Virtual Science Lab is an online educational platform that provides interactive virtual laboratories for chemistry and physics experiments.
                            The service includes AI-powered assistance for conducting experiments and learning scientific concepts.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">3. User Accounts</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account
                            credentials and for all activities that occur under your account. You agree to provide accurate and complete information
                            when creating an account and to update such information as necessary.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">4. Educational Purpose</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            This platform is designed for educational purposes only. The virtual experiments are simulations and should not be considered
                            a substitute for actual laboratory work in appropriate educational settings. Results from simulations are for learning
                            and demonstration purposes only.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">5. AI Assistant Usage</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            The AI assistant feature is provided to enhance your learning experience. The AI provides educational guidance but should
                            not be considered an absolute authority. Always verify information through multiple educational resources when appropriate.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">6. Content and Intellectual Property</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            All content on this platform, including but not limited to designs, graphics, simulations, and software, is the property
                            of Virtual Science Lab or its licensors and is protected by copyright and other intellectual property laws. You may not
                            reproduce, distribute, or create derivative works without express written permission.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">7. User Conduct</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Users agree to use the service only for lawful purposes and in a manner that does not infringe the rights of others.
                            Prohibited activities include but are not limited to hacking, attempting to disrupt the service, or using the platform
                            for any illegal purposes.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">8. Limitation of Liability</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Virtual Science Lab shall not be liable for any indirect, incidental, special, or consequential damages resulting from
                            the use or inability to use the service. The platform is provided "as is" without warranties of any kind.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">9. Changes to Terms</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued
                            use of the service after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">10. Contact Information</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            If you have any questions about these Terms and Conditions, please contact us through the settings page or support channels.
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

