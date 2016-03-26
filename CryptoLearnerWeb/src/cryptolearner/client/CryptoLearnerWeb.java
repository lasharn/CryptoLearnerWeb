package cryptolearner.client;

import org.gwtbootstrap3.client.ui.Button;

import cryptolearner.shared.FieldVerifier;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.VerticalPanel;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class CryptoLearnerWeb implements EntryPoint {
	/**
	 * The message displayed to the user when the server cannot be reached or
	 * returns an error.
	 */
	private static final String SERVER_ERROR = "An error occurred while "
			+ "attempting to contact the server. Please check your network "
			+ "connection and try again.";

	/**
	 * This is the entry point method.
	 */
	@Override
	public void onModuleLoad() {
		
		// main menu buttons
		final Button caesarOption = new Button("Caesar Cipher");
		final Button substitutionOption = new Button("Substitution Cipher");
		final Button vigenereOption = new Button("Vigenre Cipher");
		
		// caesar menu buttons
		final Button caesarChallenge1 = new Button("Challenge 1");
		
		caesarOption.addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {
				RootPanel.get().clear();
				RootPanel.get("CaesarChallengeOne").add(caesarChallenge1);
			}
		});
		
		// Add the nameField and sendButton to the RootPanel
		// Use RootPanel.get() to get the entire body element
		RootPanel.get("CaesarOptionContainer").add(caesarOption);
		RootPanel.get("SubstitutionOptionContainer").add(substitutionOption);
		RootPanel.get("VigenereOptionContainer").add(vigenereOption);
	}
}
