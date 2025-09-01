import pandas as pd
import requests
import os
import sys

def download_images_from_csv(csv_file: str, url_col: str, name_col: str):
    """
    Downloads images from a list of URLs in a CSV and renames them.

    Args:
        csv_file (str): The path to the CSV file.
        url_col (str): The name of the column containing the image URLs.
        name_col (str): The name of the column containing the desired image names.
    """
    try:
        # Check if the CSV file exists
        if not os.path.exists(csv_file):
            print(f"Error: The file '{csv_file}' was not found.")
            sys.exit(1)

        # Read the CSV file into a pandas DataFrame
        df = pd.read_csv(csv_file)

        # Check if the specified columns exist in the DataFrame
        if url_col not in df.columns:
            print(f"Error: The column '{url_col}' was not found in the CSV.")
            sys.exit(1)
        if name_col not in df.columns:
            print(f"Error: The column '{name_col}' was not found in the CSV.")
            sys.exit(1)

        # Create a directory to save the images
        if not os.path.exists('downloaded_images'):
            os.makedirs('downloaded_images')

        # Iterate over each row of the DataFrame
        for index, row in df.iterrows():
            image_url = row[url_col]
            image_name_base = row[name_col]

            # Ensure both the URL and name are not empty
            if pd.isna(image_url) or pd.isna(image_name_base):
                print(f"Skipping row {index}: missing URL or name.")
                continue

            try:
                # Send a GET request to the image URL
                response = requests.get(image_url, stream=True)
                response.raise_for_status()  # Raise an HTTPError for bad responses

                # Get the file extension from the URL
                ext = os.path.splitext(image_url)[1]
                if not ext:
                    # Default to .jpg if no extension is found
                    ext = '.jpg' 
                
                # Create the full file path for saving the image
                file_path = os.path.join('downloaded_images', f"{image_name_base}{ext}")

                # Save the image content to the file
                with open(file_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                
                print(f"Successfully downloaded and saved {image_name_base}{ext}")
            
            except requests.exceptions.RequestException as e:
                print(f"Failed to download {image_url}: {e}")
            except IOError as e:
                print(f"Failed to save {image_name_base}: {e}")

    except Exception as e:
        print(f"An unexpected error occurred: {e}")


if __name__ == '__main__':
    # Define your file and column names here
    csv_filename = 'public/images/database.csv'
    url_column = 'parsed image'
    name_column = 'ID'

    # Run the download function
    download_images_from_csv(csv_filename, url_column, name_column)